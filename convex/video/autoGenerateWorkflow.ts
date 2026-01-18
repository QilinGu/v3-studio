import { Infer, v } from "convex/values";
import { workflow } from "../index";
import { internal } from "../_generated/api";
import { characterSchema } from "../schema";
import { Id } from "../_generated/dataModel";

export const autoGenerateVideoWorkflow = workflow.define({
  args: {
    videoId: v.id("videos"),
    userId: v.id("users"),
  },
  handler: async (step, args) => {

    // Get video
    const video = await step.runQuery(internal.video.video.getInternalVideo, {
      id: args.videoId,
      userId: args.userId,
    });

    try {
      console.log('Auto Generating Workflow Started')

      // Generate ALL character images IN PARALLEL with individual error handling
      console.log('Generating character images...')

      const characterGenerationResults = await Promise.all(
        video.characters
          .map((character: typeof characterSchema.type, index: number) => ({ character, index })) // preserve index
          .filter(({ character }) => !character.imageUrl)
          .map(({ character, index }) => {
            console.log('Generating character image:', character.name);
            return step.runAction(
              internal.video.generateVideoImage.internalGenerateCharacterImage,
              {
                prompt: character.imagePrompt,
                aspectRatio: video.aspectRatio,
                videoId: args.videoId,
                characterIndex: index, // ✅ original index
                userId: args.userId,
              }
            ).catch((error) => {
              console.error(`Failed to generate character image for ${character.name}:`, error);
              return null; // Don't throw, continue with other characters
            });
          })
      );

      const failedCharacterCount = characterGenerationResults.filter(r => r === null).length;
      if (failedCharacterCount > 0) {
        console.log(`${failedCharacterCount} character image(s) failed in first attempt`);
      }

      // Re-fetch the video after character generation
      let updatedVideoAfterCharactersGenerated = await step.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: args.userId,
      })

      let allCharactersGenerated = updatedVideoAfterCharactersGenerated.characters.every((character) => character.imageUrl)

      // check whether all characters are generated and if not wait for them to be generated
      if (!allCharactersGenerated) {
        console.error('Not all characters generated, wait for them to be generated and retry after 10 seconds')
        await new Promise(resolve => setTimeout(resolve, 10000))

        // fetch the updated video again
        updatedVideoAfterCharactersGenerated = await step.runQuery(internal.video.video.getInternalVideo, {
          id: args.videoId,
          userId: args.userId,
        })

        allCharactersGenerated = updatedVideoAfterCharactersGenerated.characters.every((character) => character.imageUrl)

        // again if all the characters are not generated then re run the character generate workflow
        if (!allCharactersGenerated) {
          // Generate ALL character images IN PARALLEL for the second time
          console.log('Characters are not generated even after waiting for 10 seconds')
          console.log('Generating character images for the second time...')

          await Promise.all(
            updatedVideoAfterCharactersGenerated.characters
              .map((character, index) => ({ character, index })) // preserve index
              .filter(({ character }) => !character.imageUrl)
              .map(({ character, index }) => {
                console.log('Generating character image:', character.name);
                return step.runAction(
                  internal.video.generateVideoImage.internalGenerateCharacterImage,
                  {
                    prompt: character.imagePrompt,
                    aspectRatio: video.aspectRatio,
                    videoId: args.videoId,
                    characterIndex: index, // ✅ original index
                    userId: args.userId,
                  }
                ).catch((error) => {
                  console.error(`Failed to generate character image for ${character.name} (retry):`, error);
                  return null; // Don't throw, continue with other characters
                });
              })
          );

          // Re-fetch the video after character generation
          updatedVideoAfterCharactersGenerated = await step.runQuery(internal.video.video.getInternalVideo, {
            id: args.videoId,
            userId: args.userId,
          })

          // check whether all characters are generated and if not wait for them to be generated
          allCharactersGenerated = updatedVideoAfterCharactersGenerated.characters.every((character) => character.imageUrl)

          // again if all the characters are not generated then aborting the auto generate workflow
          if (!allCharactersGenerated) {
            console.error('Not all characters generated even after running it for the second time. Hence aborting the auto generate workflow')

            await step.runMutation(internal.video.video.updateInternalVideo, {
              id: args.videoId,
              userId: args.userId,
              update: {
                autoGenerate: false,
                autoGenerateError: `Not all characters generated even after running it for the second time. Hence aborting the auto generate workflow`,
              },
            });

            return null; // ✅ NEVER throw
          } else {
            console.log('All characters generated in the second try')
          }
        } else {
          console.log('All characters generated after waiting for 10 seconds')
        }
      } else {
        console.log('All characters generated in the first try')
      }

      console.log('Starting scene generation workflow')

      // Helper function to generate scene assets with error handling
      const generateSceneAssets = async (videoData: typeof updatedVideoAfterCharactersGenerated, retryAttempt: number = 1) => {
        const failedScenes: { sceneIndex: number; error: string; type: 'audio' | 'image' }[] = [];

        await Promise.all(
          videoData.scenes.map(async (scene, sceneIndex) => {
            const tasks: Promise<any>[] = [];
            console.log(`Generating scene ${sceneIndex} assets (attempt ${retryAttempt})`);

            // Audio generation with individual error handling
            if (!scene.audioUrl && scene.narration) {
              console.log('Generating audio for scene:', sceneIndex)
              tasks.push(
                step.runAction(internal.video.generateAudio.internalGenerateAudio, {
                  text: scene.narration,
                  voiceId: video.voice.voiceId,
                  videoId: args.videoId,
                  sceneIndex: sceneIndex,
                  userId: args.userId,
                }).catch((error) => {
                  console.error(`Failed to generate audio for scene ${sceneIndex}:`, error);
                  failedScenes.push({ sceneIndex, error: String(error), type: 'audio' });
                  return null; // Don't throw, continue with other scenes
                })
              )
            } else {
              console.log('Skipping audio generation for scene:', sceneIndex)
            }

            // Image generation with individual error handling
            if (!scene.imageUrl) {
              console.log('Generating image for scene:', sceneIndex)
              tasks.push(
                step.runAction(internal.video.generateVideoImage.internalGenerateSceneImage, {
                  prompt: scene.imagePrompt,
                  aspectRatio: video.aspectRatio,
                  characterImageIds: generateCharacterIds({
                    characters: videoData.characters,
                    characterNames: scene.charactersInTheScene ?? [],
                  }) as Id<'_storage'>[],
                  videoId: args.videoId,
                  sceneIndex: sceneIndex,
                  userId: args.userId,
                }).catch((error) => {
                  console.error(`Failed to generate image for scene ${sceneIndex}:`, error);
                  failedScenes.push({ sceneIndex, error: String(error), type: 'image' });
                  return null; // Don't throw, continue with other scenes
                })
              )
            } else {
              console.log('Skipping image generation for scene:', sceneIndex)
            }

            await Promise.all(tasks);
          })
        );

        return failedScenes;
      };

      // First attempt at scene asset generation
      let failedSceneAssets = await generateSceneAssets(updatedVideoAfterCharactersGenerated, 1);

      // If there were failures, wait and retry
      if (failedSceneAssets.length > 0) {
        console.log(`${failedSceneAssets.length} scene asset(s) failed. Waiting 10 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Re-fetch video and retry failed scenes
        const videoAfterFirstAttempt = await step.runQuery(internal.video.video.getInternalVideo, {
          id: args.videoId,
          userId: args.userId,
        });

        failedSceneAssets = await generateSceneAssets(videoAfterFirstAttempt, 2);

        if (failedSceneAssets.length > 0) {
          console.error(`${failedSceneAssets.length} scene asset(s) still failed after retry:`, failedSceneAssets);
        }
      }

      const videoAfterSceneAssets = await step.runQuery(
        internal.video.video.getInternalVideo,
        {
          id: args.videoId,
          userId: args.userId,
        }
      );

      // Check which scenes are missing images (required for video generation)
      const scenesWithoutImages = videoAfterSceneAssets.scenes
        .map((scene, index) => ({ scene, index }))
        .filter(({ scene }) => !scene.imageUrl);

      if (scenesWithoutImages.length > 0) {
        console.error(`${scenesWithoutImages.length} scene(s) still missing images after retries:`,
          scenesWithoutImages.map(s => s.index));
      }

      // Generate scene videos SEQUENTIALLY to ensure Convex workflow handles them correctly
      // Using Promise.all with step.runAction can cause issues with durable execution
      const failedVideos: { sceneIndex: number; error: string }[] = [];

      for (let sceneIndex = 0; sceneIndex < videoAfterSceneAssets.scenes.length; sceneIndex++) {
        const scene = videoAfterSceneAssets.scenes[sceneIndex];

        if (!scene.imageUrl) {
          console.error(`Skipping video generation for scene ${sceneIndex}, missing image`);
          failedVideos.push({ sceneIndex, error: 'Missing scene image' });
          continue;
        }

        if (scene.videoUrl) {
          console.log(`Skipping video for scene ${sceneIndex}, already exists`);
          continue;
        }

        console.log(`Generating video for scene ${sceneIndex}...`);

        try {
          await step.runAction(internal.video.generateVideo.internalGenerateSceneVideo, {
            prompt: scene.videoPrompt,
            baseImageUrl: scene.imageUrl,
            videoId: args.videoId,
            sceneIndex: sceneIndex,
            userId: args.userId,
          });
          console.log(`Video generation completed for scene ${sceneIndex}`);
        } catch (error) {
          console.error(`Failed to generate video for scene ${sceneIndex}:`, error);
          failedVideos.push({ sceneIndex, error: String(error) });
        }
      }

      // Retry failed videos (excluding missing images)
      const retriableFailedVideos = failedVideos.filter(f => f.error !== 'Missing scene image');
      if (retriableFailedVideos.length > 0) {
        console.log(`${retriableFailedVideos.length} video(s) failed. Waiting 10 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Re-fetch video for retry
        const videoForRetry = await step.runQuery(internal.video.video.getInternalVideo, {
          id: args.videoId,
          userId: args.userId,
        });

        for (const failed of retriableFailedVideos) {
          const scene = videoForRetry.scenes[failed.sceneIndex];

          if (scene.videoUrl) {
            console.log(`Skipping retry for scene ${failed.sceneIndex}, video now exists`);
            continue;
          }

          if (!scene.imageUrl) {
            console.error(`Cannot retry scene ${failed.sceneIndex}, still missing image`);
            continue;
          }

          console.log(`Retrying video generation for scene ${failed.sceneIndex}...`);

          try {
            await step.runAction(internal.video.generateVideo.internalGenerateSceneVideo, {
              prompt: scene.videoPrompt,
              baseImageUrl: scene.imageUrl,
              videoId: args.videoId,
              sceneIndex: failed.sceneIndex,
              userId: args.userId,
            });
            console.log(`Retry succeeded for scene ${failed.sceneIndex}`);
          } catch (error) {
            console.error(`Retry failed for scene ${failed.sceneIndex}:`, error);
          }
        }
      }

      // Final status check
      const finalVideo = await step.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: args.userId,
      });

      const incompleteScenes = finalVideo.scenes
        .map((scene, index) => ({
          index,
          missingAudio: !scene.audioUrl && scene.narration,
          missingImage: !scene.imageUrl,
          missingVideo: !scene.videoUrl,
        }))
        .filter(s => s.missingAudio || s.missingImage || s.missingVideo);

      if (incompleteScenes.length > 0) {
        const errorDetails = incompleteScenes.map(s => {
          const missing: string[] = [];
          if (s.missingAudio) missing.push('audio');
          if (s.missingImage) missing.push('image');
          if (s.missingVideo) missing.push('video');
          return `Scene ${s.index}: missing ${missing.join(', ')}`;
        }).join('; ');

        console.error('Workflow completed with incomplete scenes:', errorDetails);

        await step.runMutation(internal.video.video.updateInternalVideo, {
          id: args.videoId,
          userId: args.userId,
          update: {
            autoGenerate: false,
            autoGenerateError: `Partial completion: ${errorDetails}`,
          },
        });

        return null;
      }

      // Mark autoGenerate = false at the END
      await step.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: args.userId,
        update: {
          autoGenerate: false,
        },
      });
      return null
    } catch (error) {
      console.error(error);
      // Mark autoGenerate = false at the END
      await step.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: args.userId,
        update: {
          autoGenerate: false,
          autoGenerateError: `${error}`,
        },
      });
      return null
    }
  }
});

const generateCharacterIds = ({
  characters,
  characterNames,
}: {
  characters: Infer<typeof characterSchema>[];
  characterNames: string[];
}) => {
  const characterImageIds: string[] = [];
  const missingCharacters: string[] = [];
  const charactersWithoutImages: string[] = [];

  for (const characterName of characterNames) {
    // Find the character in the video.characters array
    const character = characters.find(
      (char) => char.name === characterName
    );

    if (!character) {
      // Character doesn't exist in the video
      missingCharacters.push(characterName);
      continue;
    }

    if (!character.imageStorageId) {
      // Character exists but image hasn't been generated yet
      charactersWithoutImages.push(characterName);
      continue;
    }

    // Character exists and has an image
    characterImageIds.push(character.imageStorageId);

  }

  return characterImageIds;
};
