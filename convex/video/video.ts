import { v } from "convex/values";
import schema, { styleValidator, musicValidator, aspectRatioValidator, voiceValidator, sceneSchema, characterSchema, videoGenerationModelSchema, videoResolutionValidator, CAPTION_PRESETS } from "../schema";
import { Id } from "../_generated/dataModel";
import { internalMutation, internalQuery, mutation, query } from "../_generated/server";
import { partial } from "convex-helpers/validators";

const videoFields = schema.tables.videos.validator;

export const getVideos = query({
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

    if (!user) {
      throw new Error("User not found");
    }

    const videos = await ctx.db
      .query('videos')
      .withIndex('by_userId', (q) => q.eq('userId', user?._id))
      .order('desc')
      .collect();

    return videos;
  },
})

export const getVideo = query({
  args: { id: v.id('videos') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const video = await ctx.db.get(args.id)

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.userId !== user._id) {
      throw new Error("Not authenticated for this video");
    }

    return video

  }
})

export const updateVideo = mutation({
  args: {
    id: v.id("videos"),
    update: partial(videoFields),
    clearMusic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const video = await ctx.db.get(args.id)

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.userId !== user._id) {
      throw new Error("Not authenticated for this video");
    }

    console.log('update video');
    console.log({ args })

    const patch: any = {};

    // Only set music: undefined if the client explicitly asked to clear it.
    if (args.clearMusic) {
      patch.music = undefined; // this will remove the field
    } else if ("music" in args.update) {
      patch.music = args.update.music; // normal update
    }

    // Copy over other fields that are present in args.update
    // (skipping undefined ones, since they were stripped already)
    for (const [key, value] of Object.entries(args.update)) {
      if (key === "music") continue;
      patch[key] = value;
    }

    await ctx.db.patch(args.id, patch)
  }
})

export const createInternalVideo = internalMutation({
  args: {
    userId: v.id('users'),
    templateId: v.optional(v.string()),
    prompt: v.string(),
    style: styleValidator,
    music: v.optional(musicValidator),
    voice: voiceValidator,
    aspectRatio: aspectRatioValidator,
    durationInSecs: v.number(),
    numberOfImagesPerPrompt: v.number(),
    generateMultipleAngles: v.boolean(),
    title: v.optional(v.string()),
    characters: v.array(characterSchema),
    scenes: v.array(sceneSchema),
    storyTellingStyle: v.optional(v.union(v.literal('default'), v.literal('dramatic'))),
    videoGenerationModel: v.optional(videoGenerationModelSchema),
    resolution: v.optional(videoResolutionValidator),
  },
  handler: async (ctx, args): Promise<Id<'videos'>> => {
    const video = await ctx.db
      .insert('videos', {
        userId: args.userId,
        templateId: args.templateId,
        prompt: args.prompt,
        style: args.style,
        music: args.music,
        voice: args.voice,
        aspectRatio: args.aspectRatio,
        durationInSecs: args.durationInSecs,
        numberOfImagesPerPrompt: args.numberOfImagesPerPrompt,
        generateMultipleAngles: args.generateMultipleAngles,
        title: args.title,
        characters: args.characters,
        scenes: args.scenes,
        storyTellingStyle: args.storyTellingStyle,
        videoGenerationModel: args?.videoGenerationModel,
        resolution: args?.resolution,
        captionStyle: CAPTION_PRESETS.classic,
      })

    return video
  }
})

export const getInternalVideo = internalQuery({
  args: {
    id: v.id('videos'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {

    const video = await ctx.db.get(args.id)

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.userId !== args.userId) {
      throw new Error("Not authenticated for this video");
    }

    return video

  }
})

export const updateInternalVideo = internalMutation({
  args: {
    id: v.id("videos"),
    userId: v.id('users'),
    update: partial(videoFields),
  },
  handler: async (ctx, args) => {

    const video = await ctx.db.get(args.id)

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.userId !== args.userId) {
      throw new Error("Not authenticated for this video");
    }

    await ctx.db.patch(args.id, args.update)
  }
})
