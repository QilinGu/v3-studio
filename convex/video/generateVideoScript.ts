'use node'

import { GoogleGenAI } from "@google/genai";
import { videoGenerationPrompt, videoGenerationPromptDramatic, videoGenerationPromptPremium, videoGenerationPromptPremiumDramatic } from "../helper";
import { generateTemplatePrompt } from "../templateprompt";
import { v } from "convex/values";
import { action } from "../_generated/server";
import { styleValidator, musicValidator, aspectRatioValidator, voiceValidator, videoResolutionValidator, videoGenerationModelSchema } from "../schema";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const createVideoBlueprint = action({
  args: {
    templateId: v.optional(v.string()),
    prompt: v.string(),
    style: styleValidator,
    music: v.optional(musicValidator),
    voice: voiceValidator,
    durationInSecs: v.number(),
    aspectRatio: aspectRatioValidator,
    numberOfImagesPerPrompt: v.number(),
    generateMultipleAngles: v.boolean(),
    storyTellingStyle: v.optional(v.union(v.literal('default'), v.literal('dramatic'))),
    videoGenerationModel: v.optional(videoGenerationModelSchema),
    resolution: v.optional(videoResolutionValidator),

  },
  handler: async (ctx, args): Promise<Id<'videos'>> => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(internal.user.getInternalUser, {
      subject: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.credits < 5) {
      throw new Error("Insufficient credits");
    }

    console.log('create video');

    const modelCategory = args?.videoGenerationModel?.category || 'standard';

    // Check if templateId is provided and use template-specific prompt
    let prompt: string;
    if (args.templateId) {
      const templatePrompt = generateTemplatePrompt(
        args.templateId,
        args.prompt,
        args.style,
        args.durationInSecs,
        args.aspectRatio
      );
      if (templatePrompt) {
        prompt = templatePrompt;
      } else {
        // Fallback to default prompt if template not found
        prompt = (modelCategory === 'standard')
          ? videoGenerationPrompt(args.prompt, args.style, args.durationInSecs, args.aspectRatio)
          : videoGenerationPromptPremium(args.prompt, args.style, args.durationInSecs, args.aspectRatio);
      }
    } else {
      // Use default prompts based on model category and storytelling style
      prompt = (modelCategory === 'standard')
        ? ((args.storyTellingStyle === 'dramatic')
          ? videoGenerationPromptDramatic(args.prompt, args.style, args.durationInSecs, args.aspectRatio)
          : videoGenerationPrompt(args.prompt, args.style, args.durationInSecs, args.aspectRatio))
        : ((args.storyTellingStyle === 'dramatic')
          ? videoGenerationPromptPremiumDramatic(args.prompt, args.style, args.durationInSecs, args.aspectRatio)
          : videoGenerationPromptPremium(args.prompt, args.style, args.durationInSecs, args.aspectRatio));
    }

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    console.log(response.text);

    const cleanJsonString = response.text
      .replace(/^```json\s*\n?/g, '')         // Remove leading ```json
      .replace(/\n?```\s*$/g, '')             // Remove trailing ```
      .trim();

    console.log(cleanJsonString);

    const blueprint = JSON.parse(cleanJsonString);

    console.log(blueprint);

    const video = await ctx.runMutation(internal.video.video.createInternalVideo, {
      userId: user._id,
      templateId: args.templateId,
      prompt: args.prompt,
      style: args.style,
      music: args.music,
      voice: args.voice,
      aspectRatio: args.aspectRatio,
      durationInSecs: args.durationInSecs,
      numberOfImagesPerPrompt: args.numberOfImagesPerPrompt,
      generateMultipleAngles: args.generateMultipleAngles,
      title: blueprint.title,
      characters: blueprint.characters,
      scenes: blueprint.scenes,
      storyTellingStyle: args.storyTellingStyle,
      videoGenerationModel: args?.videoGenerationModel,
      resolution: args?.resolution,
    })

    // update credits
    await ctx.runMutation(internal.user.decreaseInternalCredits, {
      subject: identity.subject,
      amount: 5,
    });

    return video

  }
})

