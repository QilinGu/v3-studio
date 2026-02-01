import { v } from "convex/values";
import { action, query, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Helper function to verify admin access
async function verifyAdminAccess(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_subject", (q: any) => q.eq("subject", identity.subject))
    .unique();

  if (!currentUser?.isAdmin) {
    throw new Error("Not authorized - admin access required");
  }

  return currentUser;
}

// Public query to get all users (admin only)
export const getAllUsersForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await verifyAdminAccess(ctx);

    const users = await ctx.db
      .query('users')
      .collect();

    return users.map(user => ({
      _id: user._id,
      _creationTime: user._creationTime,
      name: user.name,
      email: user.email,
      credits: user.credits,
      subscriptionProductId: user.subscriptionProductId,
      onboardingDone: user.onboardingDone,
      isAdmin: user.isAdmin,
    }));
  },
});

// Get videos for a specific user (admin only)
export const getUserVideosForAdmin = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await verifyAdminAccess(ctx);

    const videos = await ctx.db
      .query("videos")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return videos.map(video => ({
      _id: video._id,
      _creationTime: video._creationTime,
      title: video.title,
      prompt: video.prompt,
      style: video.style,
      aspectRatio: video.aspectRatio,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      creditsUsed: video.creditsUsed,
    }));
  },
});

// Get ads for a specific user (admin only)
export const getUserAdsForAdmin = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await verifyAdminAccess(ctx);

    const ads = await ctx.db
      .query("ads")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return ads.map(ad => ({
      _id: ad._id,
      description: ad.description,
      adImageUrl: ad.adImageUrl,
      adVideoUrl: ad.adVideoUrl,
      aspectRatio: ad.aspectRatio,
    }));
  },
});

// Internal query to get all users
export const getAllUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query('users')
      .collect();

    return users;
  },
});

// Internal mutation to get users with missing emails
export const getUsersWithMissingEmails = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query('users')
      .collect();

    // Filter users where email is null, undefined, or empty string
    const usersWithMissingEmails = users.filter(user =>
      !user.email || user.email.trim() === ''
    );

    return usersWithMissingEmails.map(user => ({
      _id: user._id,
      subject: user.subject,
    }));
  }
});

// Internal mutation to update a user's email
export const updateUserEmail = internalMutation({
  args: {
    userId: v.id('users'),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      email: args.email,
    });
  }
});

// Action to backfill emails from Clerk for users missing email data
export const backfillUserEmailsFromClerk = action({
  args: {},
  handler: async (ctx): Promise<{
    totalUsersChecked: number;
    updatedCount: number;
    errors: Array<{ subject: string; error: string }>;
    success: boolean;
  }> => {
    // Get all users with missing emails
    const usersWithMissingEmails = await ctx.runMutation(
      internal.admin.getUsersWithMissingEmails,
    );

    let updatedCount = 0;
    const errors: Array<{ subject: string; error: string }> = [];

    console.log(`Found ${usersWithMissingEmails.length} users with missing emails`);

    for (const user of usersWithMissingEmails) {
      try {
        // Clerk user IDs are stored in the 'subject' field
        const clerkUserId = user.subject;

        // Fetch user data from Clerk's Backend API
        const clerkResponse = await fetch(
          `https://api.clerk.com/v1/users/${clerkUserId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!clerkResponse.ok) {
          throw new Error(`Failed to fetch Clerk user: ${clerkResponse.statusText}`);
        }

        const clerkUser = await clerkResponse.json();

        // Clerk stores email in email_addresses array
        const primaryEmail = clerkUser.email_addresses?.find(
          (email: any) => email.id === clerkUser.primary_email_address_id
        )?.email_address;

        if (primaryEmail) {
          // Update the user's email
          await ctx.runMutation(internal.admin.updateUserEmail, {
            userId: user._id,
            email: primaryEmail,
          });

          updatedCount++;
          console.log(`Updated email for user ${user.subject}: ${primaryEmail}`);
        } else {
          console.log(`No primary email found in Clerk for user ${user.subject}`);
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          subject: user.subject,
          error: errorMessage,
        });
        console.error(`Error updating user ${user.subject}:`, errorMessage);
      }
    }

    return {
      totalUsersChecked: usersWithMissingEmails.length,
      updatedCount,
      errors,
      success: errors.length === 0,
    };
  }
});
