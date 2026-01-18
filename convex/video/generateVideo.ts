'use node'

import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action, internalAction } from "../_generated/server";
import Replicate from "replicate";
import { AssemblyAI, SpeechModel } from "assemblyai";
import { Doc, Id } from "../_generated/dataModel";

import { buildPremiumVideoPrompt } from "../helper";
import { sceneSchema } from "../schema";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const assemblyAiClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY as string,
});

export const generateSceneVideo = action({
  args: {
    prompt: v.string(),
    baseImageUrl: v.string(),
    videoId: v.id('videos'),
    sceneIndex: v.number(),
  },
  handler: async (ctx, args): Promise<{ videoStorageId: Id<'_storage'>, videoUrl: string }> => {
    return await ctx.runAction(internal.video.generateVideo.internalGenerateSceneVideo, args)
  }
})

export const internalGenerateSceneVideo = internalAction({
  args: {
    prompt: v.string(),
    baseImageUrl: v.string(),
    videoId: v.id('videos'),
    sceneIndex: v.number(),
    userId: v.optional(v.id('users'))
  },
  handler: async (ctx, args): Promise<{ videoStorageId: Id<'_storage'>, videoUrl: string }> => {

    console.log('generate scene video');

    let user: Doc<'users'> | null = null

    if (!args.userId) {
      const identity = await ctx.auth.getUserIdentity();

      if (identity === null) {
        throw new Error("Not authenticated");
      }

      user = await ctx.runQuery(internal.user.getInternalUser, {
        subject: identity.subject,
      });
    } else {
      user = await ctx.runQuery(internal.user.getInternalUserByUserId, {
        userId: args.userId,
      });

    }

    if (!user) {
      throw new Error("User not found");
    }

    // Get video
    let video = await ctx.runQuery(internal.video.video.getInternalVideo, {
      id: args.videoId,
      userId: user._id,
    });

    if (!video) {
      throw new Error("Video not found");
    }

    const creditsForVideoGeneration = video?.videoGenerationModel?.category === 'premium' ? 40 : 10

    if (user.credits < creditsForVideoGeneration) {
      throw new Error("Insufficient credits");
    }

    try {
      // update scene videoInProcess
      const updatedScenesWithInProcess = video.scenes.map((scene: typeof sceneSchema.type, index: number) =>
        index === args.sceneIndex
          ? { ...scene, videoInProcess: true }
          : scene
      );

      // Update video
      await ctx.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: user._id,
        update: {
          scenes: updatedScenesWithInProcess,
        },
      });

      const model = video?.videoGenerationModel?.model || "wan-video/wan-2.2-i2v-fast";

      const scene = video.scenes[args.sceneIndex]

      const input = model === "wan-video/wan-2.2-i2v-fast" ? {
        image: args.baseImageUrl,
        prompt: args.prompt,
        resolution: video?.resolution || "720p",
      } : {
        image: args.baseImageUrl,
        prompt: buildPremiumVideoPrompt(args.prompt, scene.charactersInTheScene, video.characters),
        aspectRatio: video.aspectRatio,
        resolution: video?.resolution || "720p",
      }

      const output = await replicate.run(model, { input });

      // @ts-expect-error replicate.run() has the url() method
      const resp = await fetch(output.url());

      const videoBlob = await resp.blob();

      // Store video in storage
      const videoStorageId = await ctx.storage.store(videoBlob);

      // Get video url
      const videoUrl = await ctx.storage.getUrl(videoStorageId);

      if (!videoUrl) {
        throw new Error("Failed to generate URL for stored file");
      }

      // Get video
      video = await ctx.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: user._id,
      });

      if (video?.videoGenerationModel?.category === 'premium') {

        // Generate captions with AssemblyAI

        const speechModel: SpeechModel = "universal"
        const params = {
          audio: videoUrl as string,
          speech_model: speechModel,
        }

        const captionResponse = await assemblyAiClient.transcripts.transcribe(params);

        if (!captionResponse.words) {
          throw new Error("Failed to generate captions");
        }

        // Store captions in video
        const words = captionResponse.words.map((word) => ({
          text: word.text,
          startMs: word.start,
          endMs: word.end,
        }));

        // Update only the scenes array
        const updatedScenes = video.scenes.map((scene: typeof sceneSchema.type, index: number) =>
          index === args.sceneIndex
            ? { ...scene, videoId: videoStorageId, videoUrl: videoUrl, words: words }
            : scene
        );

        // Update video
        await ctx.runMutation(internal.video.video.updateInternalVideo, {
          id: args.videoId,
          userId: user._id,
          update: {
            scenes: updatedScenes,
          },
        });
      } else {

        // Update only the scenes array
        const updatedScenes = video.scenes.map((scene: typeof sceneSchema.type, index: number) =>
          index === args.sceneIndex
            ? { ...scene, videoId: videoStorageId, videoUrl: videoUrl }
            : scene
        );

        // Update video
        await ctx.runMutation(internal.video.video.updateInternalVideo, {
          id: args.videoId,
          userId: user._id,
          update: {
            scenes: updatedScenes,
          },
        });
      }

      // update credits
      await ctx.runMutation(internal.user.decreaseInternalCredits, {
        subject: user.subject,
        amount: video?.videoGenerationModel?.category === 'premium' ? 40 : 10,
      });
      return { videoStorageId, videoUrl }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // Get video
      video = await ctx.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: user._id,
      });

      // update scene videoInProcess
      const updatedScenesWithInProcess = video.scenes.map((scene, index) =>
        index === args.sceneIndex
          ? { ...scene, videoInProcess: false }
          : scene
      );

      // Update video
      await ctx.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: user._id,
        update: {
          scenes: updatedScenesWithInProcess,
        },
      });
    }

  }
})
