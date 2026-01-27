import { v } from "convex/values";
import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('subject'), identity.subject))
      .unique();

    return user;
  },
});

export const addUser = action({
  args: {},
  handler: async (ctx): Promise<Doc<'users'> | null | undefined> => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user: Doc<'users'> | null = await ctx.runQuery(internal.user.getInternalUser, {
      subject: identity.subject,
    });

    if (user) {
      return user
    }

    // Create Polar customer with identity.subject as external customer ID
    const polarResponse = await fetch(`${process.env.POLAR_BASE_URL}/v1/customers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_ORGANIZATION_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: identity.email,
        name: identity.name || 'Anonymous',
        external_id: identity.subject,
      }),
    });

    if (!polarResponse.ok) {
      throw new Error(`Failed to create Polar customer: ${polarResponse.statusText}`);
    }

    const polarCustomer = await polarResponse.json();

    const newUser = await ctx.runMutation(internal.user.createInternalUser, {
      subject: identity.subject,
      email: identity.email,
      name: identity.name,
      polarCustomerId: polarCustomer.id,
    })

    // Send welcome email to new user
    if (identity.email) {
      const userCount = await ctx.runQuery(internal.user.getUserCount);
      await ctx.runAction(internal.emails.sendWelcomeEmail, {
        email: identity.email,
        name: identity.name || 'there',
        userNumber: userCount,
      });
    }

    return newUser
  }
})

export const getCredits = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', identity.subject))
      .first();

    return user?.credits ?? 0;
  },
});

export const updateUserSubscription = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user: Doc<'users'> | null = await ctx.runQuery(internal.user.getInternalUser, {
      subject: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // get polar customer subscription state
    const polarResponse = await fetch(`${process.env.POLAR_BASE_URL}/v1/customers/${user.polarCustomerId}/state`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_ORGANIZATION_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!polarResponse.ok) {
      throw new Error(`Failed to get Polar customer subscription state: ${polarResponse.statusText}`);
    }

    const polarCustomerState = await polarResponse.json();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const activeSubscriptionProductId = polarCustomerState.active_subscriptions.find(s => s.status === 'active').product_id

    await ctx.runMutation(internal.user.updateInternalUser, {
      subject: identity.subject,
      update: {
        subscriptionProductId: activeSubscriptionProductId,
      }
    })
  },
})

export const getInternalUser = internalQuery({
  args: { subject: v.string() },
  handler: async (ctx, args): Promise<Doc<'users'> | null> => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', args.subject))
      .first();

    return user;
  }
})

// this is required for the workflow queries
export const getInternalUserByUserId = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, args): Promise<Doc<'users'> | null> => {
    const user = await ctx.db.get(args.userId);

    return user;
  }
})

export const getUserCount = internalQuery({
  args: {},
  handler: async (ctx): Promise<number> => {
    const users = await ctx.db.query('users').collect();
    return users.length;
  }
})

export const createInternalUser = internalMutation({
  args: {
    subject: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    polarCustomerId: v.string(),
  },
  handler: async (ctx, args) => {

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', args.subject))
      .first();

    if (user) {
      throw new Error(`User with subject ${args.subject} already exists`);
    }

    await ctx.db.insert('users', {
      subject: args.subject,
      email: args?.email,
      name: args.name ?? 'Anonymous',
      credits: 400,
      polarCustomerId: args.polarCustomerId,
      onboardingDone: false,
    });
  }
})

export const setInternalCredits = internalMutation({
  args: {
    subject: v.string(),
    credits: v.number(),
  },
  handler: async (ctx, args) => {

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', args.subject))
      .first();

    if (!user) {
      throw new Error(`User with subject ${args.subject} not found`);
    }

    // Build the patch object, only including fields that are not null or undefined
    const patch: Record<string, number> = {};
    if (args.credits != null) patch.credits = args.credits;

    // Only patch if there are fields to update
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(user._id, patch);
    }
  }
});

export const decreaseInternalCredits = internalMutation({
  args: {
    subject: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', args.subject))
      .first();

    if (!user) {
      throw new Error(`User with subject ${args.subject} not found`);
    }

    if (args.amount === null) {
      throw new Error("Amount cannot be null");
    }

    // Decrease credits, ensuring it doesn't go below zero
    const newCredits = Math.max(0, user.credits - args.amount);

    // Build the patch object, only including fields that are not null or undefined
    const patch: Record<string, number> = {};
    patch.credits = newCredits;

    // Only patch if there are fields to update
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(user._id, patch);
    }
  }
})

export const increaseInternalCredits = internalMutation({
  args: {
    subject: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', args.subject))
      .first();

    if (!user) {
      throw new Error(`User with subject ${args.subject} not found`);
    }

    if (args.amount === null) {
      throw new Error("Amount cannot be null");
    }

    // Decrease credits, ensuring it doesn't go below zero
    const newCredits = user.credits + args.amount;

    // Build the patch object, only including fields that are not null or undefined
    const patch: Record<string, number> = {};
    patch.credits = newCredits;

    // Only patch if there are fields to update
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(user._id, patch);
    }
  }
})



export const updateInternalUser = internalMutation({
  args: {
    subject: v.string(),
    update: v.object({
      credits: v.optional(v.number()),
      subscriptionProductId: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', args.subject))
      .first();

    if (!user) {
      throw new Error(`User with subject ${args.subject} not found`);
    }

    // Build the patch object, only including fields that are not null or undefined
    const patch: Record<string, any> = {};
    if (args.update.credits != null) patch.credits = args.update.credits;
    if (args.update.subscriptionProductId != null) patch.subscriptionProductId = args.update.subscriptionProductId;

    // Only patch if there are fields to update
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(user._id, patch);
    }
  }
});
