import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { api, internal } from "./_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple action to send to ALL users - trigger from dashboard
export const sendToAllUsers = action({
  args: {
    subject: v.string(),
    message: v.string(),
    fromName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.runQuery(internal.admin.getAllUsers);

    const results = {
      total: 0,
      sent: 0,
      failed: 0,
      details: [] as any[],
    };

    for (const user of users) {
      if (user.email) {
        results.total++;

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">${args.subject}</h2>
            <div style="color: #666; line-height: 1.6;">
              ${args.message}
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              Sent from V3 Studio
            </p>
          </div>
        `;

        try {
          const { data, error } = await resend.emails.send({
            from: `${args.fromName || "V3 Studio"} <no-reply@notify.v3-studio.com>`,
            to: user.email,
            subject: args.subject,
            html: html,
          });

          if (error) {
            results.failed++;
            results.details.push({
              email: user.email,
              status: "failed",
              error: error.message
            });
          } else {
            results.sent++;
            results.details.push({
              email: user.email,
              status: "sent",
              id: data?.id
            });
          }

          // Rate limit protection
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          results.failed++;
          results.details.push({
            email: user.email,
            status: "failed",
            error: String(error)
          });
        }
      }
    }

    return results;
  },
});

// Send to a specific email - for testing
export const sendTestEmail = action({
  args: {
    toEmail: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">${args.subject}</h2>
        <div style="color: #666; line-height: 1.6;">
          ${args.message}
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          Test email from V3 Studio
        </p>
      </div>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: "V3 Studio <no-reply@notify.v3-studio.com>",
        to: args.toEmail,
        subject: args.subject,
        html: html,
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: `Email sent to ${args.toEmail}`,
        id: data?.id
      };
    } catch (error) {
      return {
        success: false,
        error: String(error)
      };
    }
  },
});

// Get user count - helpful to check before sending
export const getUserCount = action({
  args: {},
  handler: async (ctx): Promise<{
    totalUsers: number;
    usersWithEmail: number;
    emails: (string | null | undefined)[];
  }> => {
    const users = await ctx.runQuery(internal.admin.getAllUsers);
    const usersWithEmail = users.filter(u => u.email);

    return {
      totalUsers: users.length,
      usersWithEmail: usersWithEmail.length,
      emails: usersWithEmail.map(u => u.email),
    };
  },
});

// Send welcome email to new users
export const sendWelcomeEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    userNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="color: #374151; line-height: 1.6;">
          <p>Hi ${args.name},</p>
          <p>Welcome to V3 Studio! You are user <strong>#${args.userNumber}</strong> and I'm so glad to have you here.</p>
          <p>My name is Deb and I'm the solo developer behind V3 Studio. Thank you for trying it out.</p>
          <p>As a creator of this product, nothing gives me more joy than the fact that my creation is accepted and can really add value to its intended customers like you.</p>
          <p style="margin-top: 20px;"><strong>Here's what you get to start:</strong></p>
          <ul style="margin-left: 20px; line-height: 1.8;">
            <li><strong>400 free credits</strong> to create your first videos</li>
            <li>Access to AI-powered short-form video generation</li>
            <li>Full control over your video creation process</li>
          </ul>
          <p style="margin-top: 20px;">If at any point you need help or have questions, I'm happy to personally guide you—reach out to us at <a href="mailto:team@v3-studio.com" style="color: #4F46E5; text-decoration: none;">team@v3-studio.com</a> or use our <a href="https://www.v3-studio.com/contact-us" style="color: #4F46E5; text-decoration: none;">contact page</a>.</p>
          <p>I'd love to hear your feedback as you try things out.</p>
          <p style="margin-top: 30px;">Warm regards,<br><strong>Debasish</strong><br><span style="color: #6B7280;">Creator of V3 Studio</span><br><a href="https://www.v3-studio.com" style="color: #4F46E5; text-decoration: none;">www.v3-studio.com</a></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">Please do not reply to this email. For questions or feedback, contact us at <a href="mailto:team@v3-studio.com" style="color: #4F46E5;">team@v3-studio.com</a> or visit our <a href="https://www.v3-studio.com/contact-us" style="color: #4F46E5;">contact page</a>.</p>
        </div>
      </div>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: "V3 Studio <no-reply@notify.v3-studio.com>",
        to: args.email,
        subject: "Welcome to V3 Studio!",
        html: html,
      });

      if (error) {
        console.error("Failed to send welcome email:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true, id: data?.id };
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error: String(error) };
    }
  },
});
