'use client'

import { api } from "@/convex/_generated/api"
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useAction, useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronUp, Rocket, Download, ImagePlay, Play, Plus, Save, Settings, User, Video } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { toast } from "sonner"
import { CharacterCard } from "@/components/ui/custom/character-card"
import { SceneCard } from "@/components/ui/custom/scene-card"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { VideoPlayer } from "@/components/video-editor/video-player"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { parseMedia } from '@remotion/media-parser'
import { getCachedVideoUrl } from "@/lib/video-cache"
import { cn } from "@/lib/utils"
import { characterSchema, musicValidator, voiceValidator } from "@/convex/schema"
import { Infer } from "convex/values"
import { CaptionStyleControls } from "./caption-style-control"
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AutoGenerateProgressDialog } from "@/components/video-editor/auto-generate-dialog"

import { ConfirmDialog } from '@/components/confirm-dialog'
import { useConfirmDialogHook } from '@/hooks/use-confirm-dialog-hook'
import { calculateTotalCreditsRequired } from "@/lib/functions"

import { driver } from "driver.js"
import "driver.js/dist/driver.css"

const ItemType = 'SCENE';

interface DragItem {
  index: number;
}

const DraggableSceneCard = ({
  index,
  children,
  moveScene,
}: {
  index: number;
  children: React.ReactNode;
  moveScene: (from: number, to: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: DragItem) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveScene(dragIndex, hoverIndex);
      // Mutate the item for smooth UX (react-dnd expects this)
      item.index = hoverIndex;
    },
  });

  // This is the correct way to combine refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn('transition-opacity', isDragging && 'opacity-40')}
    >
      {children}
    </div>
  );
};

export const VideoEditorComponent = ({ videoId, tour = false }: { videoId: string, tour?: boolean }) => {
  const id = videoId as Id<'videos'>;
  const video = useQuery(api.video.video.getVideo, { id: id });
  const updateVideo = useMutation(api.video.video.updateVideo);

  const user = useQuery(api.user.getUser)

  const { open, config, confirm, handleConfirm } = useConfirmDialogHook()

  const [durationInSeconds, setDurationInSeconds] = useState(0)
  const [localUrl, setLocalUrl] = useState<string | null>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [videoData, setVideoData] = useState<Doc<'videos'>>();
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    characters: true,
    scenes: true
  });
  const [expandedScenes, setExpandedScenes] = useState<Record<number, boolean>>({});
  const [expandedAngles, setExpandedAngles] = useState<Record<string, boolean>>({});

  const generateCharacterImageAction = useAction(api.video.generateVideoImage.generateCharacterImage);
  const generateSceneImageAction = useAction(api.video.generateVideoImage.generateSceneImage);
  const generateSceneVideoAction = useAction(api.video.generateVideo.generateSceneVideo)
  const generateSceneAudioAction = useAction(api.video.generateAudio.generateAudio);
  const autoGenerateVideoAction = useAction(api.video.autoGenerateVideo.autoGenerateVideo);
  const [generatingCharacter, setGeneratingCharacter] = useState<number | null>(null);
  const [generatingScene, setGeneratingScene] = useState<number | null>(null);
  const [modifyPrompts, setModifyPrompts] = useState<Record<number, string>>({});
  const [modifyingCharacter, setModifyingCharacter] = useState<number | null>(null);

  const renderVideoAction = useAction(api.render.renderVideo);

  const [isRenderEligible, setIsRenderEligible] = useState(false);

  const [activeTab, setActiveTab] = useState<'Storyline' | 'Settings'>('Settings');

  const [isSaving, setIsSaving] = useState(false);

  // Generate the array from the music validator's members
  const musics = musicValidator.members.map((member, index) => ({
    id: index + 1,
    music: {
      title: member.fields.title.value,
      previewUrl: member.fields.previewUrl.value,
    } as Infer<typeof musicValidator>,
  }));

  // Generate the array from the voice validator's members
  const voices = voiceValidator.members.map((member, index) => ({
    id: index + 1,
    voice: {
      name: member.fields.name.value,
      gender: member.fields.gender.value,
      voiceId: member.fields.voiceId.value,
      previewUrl: member.fields.previewUrl.value,
    } as Infer<typeof voiceValidator>,
  }));

  const tourRef = useRef<ReturnType<typeof driver> | null>(null);

  // Initialize videoData from query
  useEffect(() => {
    if (video) {
      setVideoData(video);
    }
  }, [video]);

  useEffect(() => {
    const loadVideoToCache = async () => {
      if (!videoData)
        return
      if (videoData.videoUrl) {
        const videoUrl = videoData.videoUrl
        const url = await getCachedVideoUrl(videoUrl)
        setLocalUrl(url)
      } else {
        if (videoData.music) {
          const videoUrl = videoData.music.previewUrl
          await getCachedVideoUrl(videoUrl)
        }
        if (videoData.scenes) {
          for (const scene of videoData.scenes) {
            if (scene.videoUrl) {
              const videoUrl = scene.videoUrl
              await getCachedVideoUrl(videoUrl)
            }
            if (scene.audioUrl) {
              const videoUrl = scene.audioUrl
              await getCachedVideoUrl(videoUrl)
            }
          }
        }
      }
    }
    loadVideoToCache()
  }, [videoData])

  useEffect(() => {
    const loadVideoData = async () => {
      console.log('Loading video data...')
      console.log({ videoData })
      if (!video || !videoData)
        return
      try {
        if (videoData.videoUrl) {
          const localUrl = await getCachedVideoUrl(videoData.videoUrl)
          const videoMetadata = await parseMedia({
            src: localUrl,
            fields: {
              slowDurationInSeconds: true,
            }
          })
          setDurationInSeconds(videoMetadata.slowDurationInSeconds)
        } else {
          console.log('No video URL found, calculating duration...')
          let totalDuration = 0

          for (const [index, scene] of videoData.scenes.entries()) {
            console.log(' inside for loop')
            if (scene.videoUrl) {
              if (scene.videoDurationInSeconds) {
                totalDuration += scene.videoDurationInSeconds
              } else {
                const localUrl = await getCachedVideoUrl(scene.videoUrl)
                const videoMetadata = await parseMedia({
                  src: localUrl,
                  fields: {
                    slowDurationInSeconds: true,
                  }
                })
                updateNestedField(`scenes[${index}].videoDurationInSeconds`, Math.round(videoMetadata.slowDurationInSeconds))
                totalDuration += videoMetadata.slowDurationInSeconds
                console.log('Scene duration:', videoMetadata.slowDurationInSeconds)
              }
            } else {
              totalDuration += 5
            }
          }

          setDurationInSeconds(totalDuration)
        }
      } catch (error) {
        console.error('Error loading video metadata:', error)
      } finally {
        setIsVideoLoading(false)
      }
    }

    loadVideoData()
  }, [video, videoData])

  useEffect(() => {
    if (!videoData) {
      return;
    }

    if (videoData.videoUrl && videoData.videoUrl !== "") {
      setIsRenderEligible(false)
      return;
    }

    const allScenesHaveUrl =
      videoData?.scenes?.length > 0 &&
      videoData.scenes.every((scene) => ((scene.videoUrl && scene.videoUrl !== "") || (scene.imageUrl && scene.imageUrl !== "")));

    setIsRenderEligible(allScenesHaveUrl);
  }, [videoData]);

  useEffect(() => {
    if (!videoData) {
      return;
    }

    if (!tour) {
      return
    }

    const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint

    const steps = [
      {
        element: '#auto-generate-button',
        popover: {
          title: 'Auto Generate',
          description: 'Click this button to Auto Generate the entire video for you. You can also generate individual characters and the scenes all by yourself',
          side: 'bottom' as const,
          align: 'start' as const,
        },
      },
      // Only show preview button step on smaller screens where the button is visible
      ...(!isLargeScreen ? [{
        element: '#preview-video-button',
        popover: {
          title: 'Preview Video',
          description: 'Click this button to preview the generated video',
          side: 'bottom' as const,
          align: 'start' as const,
        },
      }] : []),
      {
        element: '#save-changes-button',
        popover: {
          title: 'Save Changes',
          description: 'Do the changes in the scenes and Characters and Click this button to save your changes',
          side: 'bottom' as const,
          align: 'start' as const,
        },
      },
    ];

    tourRef.current = driver({
      popoverClass: 'driverjs-theme',
      allowClose: false,
      steps,
    });

    tourRef.current.drive();

    return () => {
      tourRef.current?.destroy();
    };

  }, [tour, videoData])

  if (!video || !videoData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center space-x-4">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-500 text-lg">Loading your videos...</p>
      </div>
    );
  }

  if (video.autoGenerate === true) {
    return <AutoGenerateProgressDialog video={video} />
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleScene = (sceneIndex: number) => {
    setExpandedScenes(prev => ({ ...prev, [sceneIndex]: !prev[sceneIndex] }));
  };

  const toggleAngle = (sceneIndex: number, angleIndex: number) => {
    const key = `${sceneIndex}-${angleIndex}`;
    setExpandedAngles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (field: string, value: any) => {
    console.log('Updating field:', field, 'with value:', value);
    setVideoData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (path: string, value: any) => {
    setVideoData((prev: any) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const match = key.match(/(\w+)\[(\d+)\]/);

        if (match) {
          const arrayKey = match[1];
          const index = parseInt(match[2]);
          current[arrayKey] = [...current[arrayKey]];
          current = current[arrayKey][index] = { ...current[arrayKey][index] };
        } else {
          current[key] = { ...current[key] };
          current = current[key];
        }
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addCharacter = () => {
    setVideoData((prev: any) => ({
      ...prev,
      characters: [...prev.characters, { name: "", imagePrompt: "" }]
    }));
  };

  const removeCharacter = (index: number) => {
    setVideoData((prev: any) => ({
      ...prev,
      characters: prev.characters.filter((_: any, i: number) => i !== index)
    }));
  };

  const generateCharacterImage = async ({ index, prompt, baseImageId }: { index: number, prompt: string, baseImageId?: string }) => {
    console.log('Generating character image...');
    setGeneratingCharacter(index);
    setModifyingCharacter(index);

    if (!prompt.trim()) {
      console.log('No prompt provided for character image');
      toast.error('Please enter a prompt for the character image');
      setGeneratingCharacter(null);
      return;
    }

    const confirmConfig = {
      action: 'Generating Character Image',
      requiredCredits: 5,
      balanceCredits: user?.credits ? user.credits - 5 : 0
    }

    const confirmed = await confirm(confirmConfig)

    if (!confirmed) {
      setGeneratingCharacter(null);
      setModifyingCharacter(null);
      return
    }

    try {
      let result
      if (!baseImageId) {
        result = await generateCharacterImageAction({
          prompt,
          aspectRatio: videoData.aspectRatio,
          videoId: videoData._id,
          characterIndex: index,
        });

      } else {
        result = await generateCharacterImageAction({
          prompt,
          baseImageId: baseImageId as Id<'_storage'>,
          aspectRatio: videoData.aspectRatio,
          videoId: videoData._id,
          characterIndex: index,
        });
      }

      // updateNestedField(`characters[${index}].imageStorageId`, result.imageStorageId);
      // updateNestedField(`characters[${index}].imageUrl`, result.imageUrl);

      toast.success('Character image generated successfully!');
    } catch (error) {
      console.error('Error generating character image:', error);
      toast.error('An error occurred while generating character image');
    } finally {
      setGeneratingCharacter(null);
      setModifyingCharacter(null);
    }
  }

  const addScene = (position = 'end', afterIndex = -1) => {
    setVideoData((prev: any) => {
      const newScene = {
        index: 0,
        imagePrompt: "",
        angles: [{ index: 0, angleVideoPrompt: "" }]
      };

      let newScenes;
      if (position === 'start') {
        newScenes = [newScene, ...prev.scenes];
      } else if (position === 'after') {
        newScenes = [
          ...prev.scenes.slice(0, afterIndex + 1),
          newScene,
          ...prev.scenes.slice(afterIndex + 1)
        ];
      } else {
        newScenes = [...prev.scenes, newScene];
      }

      return {
        ...prev,
        scenes: newScenes.map((scene: any, i: number) => ({ ...scene, index: i }))
      };
    });
  };

  const removeScene = (index: number) => {
    setVideoData((prev: any) => ({
      ...prev,
      scenes: prev.scenes.filter((_: any, i: number) => i !== index).map((scene: any, i: number) => ({ ...scene, index: i }))
    }));
  };

  const addAngle = (sceneIndex: number, position = 'end', afterIndex = -1) => {
    setVideoData((prev: any) => {
      const newScenes = [...prev.scenes];
      const newAngle = { index: 0, angleVideoPrompt: "" };

      let newAngles;
      if (position === 'start') {
        newAngles = [newAngle, ...newScenes[sceneIndex].angles];
      } else if (position === 'after') {
        newAngles = [
          ...newScenes[sceneIndex].angles.slice(0, afterIndex + 1),
          newAngle,
          ...newScenes[sceneIndex].angles.slice(afterIndex + 1)
        ];
      } else {
        newAngles = [...newScenes[sceneIndex].angles, newAngle];
      }

      newScenes[sceneIndex] = {
        ...newScenes[sceneIndex],
        angles: newAngles.map((angle: any, i: number) => ({ ...angle, index: i }))
      };

      return { ...prev, scenes: newScenes };
    });
  };

  const removeAngle = (sceneIndex: number, angleIndex: number) => {
    setVideoData((prev: any) => {
      const newScenes = [...prev.scenes];
      newScenes[sceneIndex] = {
        ...newScenes[sceneIndex],
        angles: newScenes[sceneIndex].angles
          .filter((_: any, i: number) => i !== angleIndex)
          .map((angle: any, i: number) => ({ ...angle, index: i }))
      };
      return { ...prev, scenes: newScenes };
    });
  };

  const generateSceneImage = async ({ index, prompt, baseImageId, characterNames = [] }: { index: number, prompt: string, baseImageId: string, characterNames?: string[] }) => {
    console.log('Generating scene image...');
    setGeneratingScene(index);

    if (!prompt.trim()) {
      console.log('No prompt provided for scene image');
      toast.error('Please enter a prompt for the scene image');
      setGeneratingScene(null);
      return;
    }

    const confirmConfig = {
      action: 'Generating Scene Image',
      requiredCredits: 5,
      balanceCredits: user?.credits ? user.credits - 5 : 0
    }

    const confirmed = await confirm(confirmConfig)

    if (!confirmed) {
      setGeneratingScene(null);
      return
    }

    try {
      let result
      if (baseImageId) {
        result = await generateSceneImageAction({
          prompt,
          baseImageId: baseImageId as Id<'_storage'>,
          aspectRatio: videoData.aspectRatio,
          videoId: videoData._id,
          sceneIndex: index,
        });

      } else {
        if (characterNames.length === 0) {
          result = await generateSceneImageAction({
            prompt,
            aspectRatio: videoData.aspectRatio,
            videoId: videoData._id,
            sceneIndex: index,
          });

        } else {
          // Validate character names and collect image IDs
          const characterImageIds = [];
          const missingCharacters = [];
          const charactersWithoutImages = [];

          for (const characterName of characterNames) {
            // Find the character in the video.characters array
            const character = video.characters.find(
              (char: typeof characterSchema.type) => char.name === characterName
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

          // Generate appropriate error messages
          if (missingCharacters.length > 0) {
            toast.error(`Following characters not found in character set: ${missingCharacters.join(", ")}`);
            throw new Error(
              `Following characters not found in character set: ${missingCharacters.join(", ")}`
            );
          }

          if (charactersWithoutImages.length > 0) {
            toast.error(`Images not yet generated for characters: ${charactersWithoutImages.join(", ")}. Please go to Settings tab and generate images for these characters first.`);
            throw new Error(
              `Images not yet generated for characters: ${charactersWithoutImages.join(", ")}. Please generate images for these characters first.`
            );
          }
          result = await generateSceneImageAction({
            prompt,
            characterImageIds,
            aspectRatio: videoData.aspectRatio,
            videoId: videoData._id,
            sceneIndex: index,
          });
        }
      }

      // updateNestedField(`scenes[${index}].imageId`, result.imageStorageId);
      // updateNestedField(`scenes[${index}].imageUrl`, result.imageUrl);

      toast.success('Scene image generated successfully!');
    } catch (error) {
      console.error('Error generating scene image:', error);
      toast.error(`Error: ${error}`);
    } finally {
      setGeneratingScene(null);
    }
  }

  const generateSceneVideo = async ({ index, prompt, baseImageUrl }: { index: number, prompt: string, baseImageUrl: string }) => {
    console.log('Generating scene video...');
    setGeneratingScene(index);

    if (!prompt.trim()) {
      console.log('No prompt provided for scene video');
      toast.error('Please enter a prompt for the scene video');
      setGeneratingScene(null);
      return;
    }

    const confirmConfig = videoData.videoGenerationModel?.category === 'premium' ? {
      action: 'Generating Scene Video',
      requiredCredits: 40,
      balanceCredits: user?.credits ? user.credits - 40 : 0
    } : {
      action: 'Generating Scene Video',
      requiredCredits: 10,
      balanceCredits: user?.credits ? user.credits - 10 : 0
    }

    const confirmed = await confirm(confirmConfig)

    if (!confirmed) {
      setGeneratingScene(null);
      return
    }

    try {
      const result = await generateSceneVideoAction({
        prompt,
        baseImageUrl: baseImageUrl,
        videoId: videoData._id,
        sceneIndex: index,
      });
      // updateNestedField(`scenes[${index}].videoId`, result.videoStorageId);
      // updateNestedField(`scenes[${index}].videoUrl`, result.videoUrl);

      toast.success('Scene video generated successfully!');
    } catch (error) {
      console.error('Error generating scene video:', error);
      toast.error('An error occurred while generating scene video');
    } finally {
      setGeneratingScene(null);
    }
  }

  const generateSceneAudio = async ({ index, text }: { index: number, text: string }) => {
    console.log('Generating scene audio...');
    setGeneratingScene(index);

    if (!text) {
      if (videoData.videoGenerationModel?.category === 'premium') {
        toast.info('Narration is optional for premium category');
        return
      } else {
        console.log('No prompt provided for scene audio');
        toast.error('Please enter a prompt for the scene audio');
        return
      }
    }
    if (!text.trim()) {
      console.log('No prompt provided for scene audio');
      toast.error('Please enter a prompt for the scene audio');
      setGeneratingScene(null);
      return;
    }

    const confirmConfig = {
      action: 'Generating Scene Audio',
      requiredCredits: 5,
      balanceCredits: user?.credits ? user.credits - 5 : 0
    }

    const confirmed = await confirm(confirmConfig)

    if (!confirmed) {
      setGeneratingScene(null);
      return
    }

    try {
      const result = await generateSceneAudioAction({
        text,
        voiceId: videoData.voice.voiceId,
        videoId: videoData._id,
        sceneIndex: index,
      });

      // updateNestedField(`scenes[${index}].audioId`, result.audioStorageId);
      // updateNestedField(`scenes[${index}].audioUrl`, result.audioUrl);

      toast.success('Scene audio generated successfully!');
    } catch (error) {
      console.error('Error generating scene audio:', error);
      toast.error('An error occurred while generating scene audio');
    } finally {
      setGeneratingScene(null);
    }
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Remove Convex system fields before saving
      const { _id, _creationTime, userId, ...updateData } = videoData;

      if (updateData.music === undefined) {
        await updateVideo({
          id: id,
          update: updateData,
          clearMusic: true
        });
      } else {
        await updateVideo({
          id: id,
          update: updateData
        });
      }
      toast.success('Video saved successfully!');
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderVideo = async () => {
    if (video.videoUrl) {
      toast.error('Video is already rendered!');
      return;
    }

    if (video.renderId) {
      toast.error('Video is already rendering!');
    }

    if (!isRenderEligible) {
      toast.error('Video is not ready to render!');
      return;
    }

    try {
      setIsSaving(true);
      await renderVideoAction({
        videoId: id,
      });
    } catch (error) {
      toast.error('Failed to render video. Please try again.');
      console.error('Error rendering video:', error);
    } finally {
      setIsSaving(false);
    }
  }

  const downloadVideo = async () => {
    if (!localUrl) {
      toast.error('Video is not rendered!');
      return;
    }
    const link = document.createElement('a');
    link.href = localUrl;
    link.download = `${video.title || 'video'}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const moveScene = (fromIndex: number, toIndex: number) => {
    setVideoData((prev: any) => {
      const newScenes = [...prev.scenes];
      const [moved] = newScenes.splice(fromIndex, 1);
      newScenes.splice(toIndex, 0, moved);

      // Re-index after reorder
      return {
        ...prev,
        scenes: newScenes.map((scene: any, i: number) => ({ ...scene, index: i }))
      };
    });
  };

  const autoGenerate = async () => {
    try {
      if (video.autoGenerate) {
        toast.info('Auto Generate is already in progress')
        return
      }

      if (video.videoUrl) {
        toast.error('Video is already rendered!');
        return;
      }

      if (video.renderId) {
        toast.error('Video is already rendering!');
        return;
      }

      const totalRequiredCredits = calculateTotalCreditsRequired(video)

      if (totalRequiredCredits === 0) {
        toast.info('The video is fully generated')
        return
      }

      const confirmConfig = {
        action: 'Auto Generating Video',
        requiredCredits: totalRequiredCredits,
        balanceCredits: user?.credits ? user.credits - totalRequiredCredits : 0
      }

      const confirmed = await confirm(confirmConfig)

      if (!confirmed) {
        setGeneratingScene(null);
        return
      }

      toast.info('Auto Generating video...')

      await autoGenerateVideoAction({
        videoId: id,
      });
      toast.success('Auto Generate started successfully!')
    } catch (error) {
      console.error('Error auto generating video:', error);
      toast.error('An error occurred while auto generating video');
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full min-h-screen bg-background text-foreground pt-0 md:px-4 lg:px-8">
        <div className="mx-auto">
          {/* Tabs */}
          <div className="flex flex-col md:flex-row items-center justify-start md:justify-between mb-12 space-y-4 md:space-y-0">
            <div className="inline-flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab('Settings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${activeTab === 'Settings'
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('Storyline')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${activeTab === 'Storyline'
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Storyline
              </button>
            </div>
            <div className="flex items-center gap-3">
              {/* Download button */}
              {localUrl && (
                <button
                  onClick={downloadVideo}
                  disabled={isSaving}
                  className={cn("mx-4 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 h-9 py-2 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all text-white rounded-md")}
                >
                  <Download className="w-5 h-5" />
                  <span className='hidden md:inline'>
                    Download Video
                  </span>
                </button>
              )}
              {!videoData.videoUrl && (
                <button
                  id='auto-generate-button'
                  onClick={autoGenerate}
                  disabled={isSaving}
                  className={cn(
                    "relative mx-4 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "h-9 py-2 px-5 rounded-md text-white overflow-hidden",
                    "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%]",
                    "hover:scale-105 active:scale-95 transition-all duration-300",
                    "shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70",
                    "animate-shimmer"
                  )}
                  style={{
                    animation: "shimmer 3s linear infinite"
                  }}
                >
                  <Rocket className="w-5 h-5" />
                  <span className='hidden md:inline'>
                    Auto Generate
                  </span>
                  <style jsx>{`
              @keyframes shimmer {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
              }
            `}</style>
                </button>
              )}
              {/* Render button */}
              {isRenderEligible && (
                <button
                  id='render-video-button'
                  onClick={renderVideo}
                  disabled={isSaving}
                  className={cn(
                    "relative mx-4 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "h-9 py-2 px-5 rounded-md text-white overflow-hidden",
                    "bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 bg-[length:200%_100%]",
                    "hover:scale-105 active:scale-95 transition-all duration-300",
                    "shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/70"
                  )}
                  style={{
                    animation: "shimmer 3s linear infinite"
                  }}
                >
                  <Video className="w-5 h-5" />
                  <span className='hidden md:inline'>
                    {(!video.videoUrl && video.renderId) ? 'Rendering...' : 'Render Video'}
                  </span>
                  <style jsx>{`
              @keyframes shimmer {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
              }
            `}</style>
                </button>
              )}
              {/* Preview Button with Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    id='preview-video-button'
                    disabled={isSaving || isVideoLoading}
                    className={cn(
                      "relative lg:hidden inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
                      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "h-9 py-2 px-5 rounded-md text-white overflow-hidden",
                      "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-[length:200%_100%]",
                      "hover:scale-105 active:scale-95 transition-all duration-300",
                      "shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70"
                    )}
                    style={{
                      animation: "shimmer 3s linear infinite"
                    }}
                  >
                    <Play className="w-4 h-4" />
                    <span className='hidden md:inline'>
                      Preview Video
                    </span>
                    <style jsx>{`
              @keyframes shimmer {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
              }
            `}</style>
                  </Button>
                </DialogTrigger>
                <DialogContent className='!max-w-[98vw] !w-[98vw] max-h-[98vh] h-[98vh] p-6 flex flex-col'>
                  <DialogHeader className='flex-shrink-0'>
                    <DialogTitle className='text-xl font-bold text-white mb-4'>Video Preview</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 flex items-center justify-center min-h-0">
                    {localUrl ? (
                      <video
                        src={localUrl}
                        controls
                        autoPlay
                        loop
                        className="rounded-lg max-w-full max-h-full"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <VideoPlayer video={videoData} durationInSeconds={Math.round(durationInSeconds)} isSubscribed={!!user?.subscriptionProductId} />
                        <div className="absolute bottom-4 left-1/4 -translate-x-1/2 bg-transparent p-4 rounded-lg w-[90%] max-w-xl pointer-events-auto z-50">
                          <CaptionStyleControls
                            value={videoData.captionStyle}
                            updateCaptionStyleAction={(newStyle) =>
                              updateField('captionStyle', newStyle)
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <button
                id='save-changes-button'
                onClick={handleSave}
                disabled={isSaving || !!video.renderId || !!video.videoUrl}
                className={cn(
                  "relative mx-4 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
                  "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "h-9 py-2 px-5 rounded-md text-white overflow-hidden",
                  "bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-[length:200%_100%]",
                  "hover:scale-105 active:scale-95 transition-all duration-300",
                  "shadow-lg shadow-pink-500/50 hover:shadow-xl hover:shadow-pink-500/70"
                )}
                style={{
                  animation: "shimmer 3s linear infinite"
                }}
              >
                <Save className="w-5 h-5" />
                <span className='hidden md:inline'>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </span>
                <style jsx>{`
              @keyframes shimmer {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
              }
            `}</style>
              </button>
            </div>
          </div>
          {/* Main content with video preview */}
          <div className={cn("lg:grid lg:gap-6", videoData.aspectRatio === '9:16' ? 'lg:grid-cols-[3fr_1fr]' : 'lg:grid-cols-2')}>
            {/* Left side - Tab content */}
            <div className="min-w-0">
              {/* General Settings */}
              {activeTab === 'Settings' && (
                <>
                  <div className="bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl mb-6 border border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleSection('general')}
                      className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-purple-400" />
                        <h2 className="text-xl font-bold text-white">General Settings</h2>
                      </div>
                      {expandedSections.general ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
                    </button>

                    {expandedSections.general && (
                      <div className="p-6 pt-0 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Initial Prompt</label>
                            <textarea
                              value={videoData.prompt}
                              disabled
                              rows={3}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                            <input
                              type="text"
                              value={videoData.title || ''}
                              onChange={(e) => updateField('title', e.target.value)}
                              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                            <input
                              type="text"
                              disabled
                              value={videoData.style}
                              onChange={(e) => updateField('style', e.target.value)}
                              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white cursor-not-allowed placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Music</label>
                            <select
                              value={videoData.music?.title ?? 'none'}
                              onChange={(e) => {
                                const value = e.target.value;

                                if (value === "none") {
                                  updateField("music", undefined);
                                  return;
                                }

                                const selected = musics.find(m => `${m.music.title}` === value);
                                if (selected) {
                                  updateNestedField('music.title', selected.music.title);
                                  updateNestedField('music.previewUrl', selected.music.previewUrl);
                                }
                              }}
                              className="w-full px-4 py-2 bg-white/5 cursor-pointer border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="none" style={{ backgroundColor: "#1E1E2D", color: "white" }}>
                                None
                              </option>
                              <option value="" disabled style={{ backgroundColor: '#1E1E2D', color: 'white' }}>Select Music</option>
                              {musics.map((music) => (
                                <option key={music.id} value={music.music.title} style={{ backgroundColor: '#1E1E2D', color: 'white' }}>
                                  {music.music.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                            <select
                              value={videoData.aspectRatio}
                              disabled
                              onChange={(e) => updateField('aspectRatio', e.target.value)}
                              className="w-full px-4 py-2 bg-white/5 cursor-not-allowed border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="9:16" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>9:16 (Portrait)</option>
                              <option value="16:9" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>16:9 (Landscape)</option>
                              <option value="1:1" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>1:1 (Square)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Video Quality</label>
                            <select
                              value={videoData.resolution || '720p'}
                              disabled
                              onChange={(e) => updateField('resolution', e.target.value)}
                              className="w-full px-4 py-2 bg-white/5 cursor-not-allowed border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="480p" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>480p</option>
                              <option value="720p" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>720p</option>
                            </select>
                          </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-300 mb-2">AI Video Model</label>
                            <select
                              value={videoData.videoGenerationModel?.category || 'standard'}
                              disabled
                              className="w-full px-4 py-2 bg-white/5 cursor-not-allowed border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="standard" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>Standard Model</option>
                              <option value="premium" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>Premium Model</option>
                            </select>
                          </div>
                          <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Voiceover</label>
                            <select
                              value={`${videoData.voice.name} (${videoData.voice.gender})`}
                              onChange={(e) => {
                                const selected = voices.find(v => `${v.voice.name} (${v.voice.gender})` === e.target.value);
                                if (selected) {
                                  updateNestedField('voice.name', selected.voice.name);
                                  updateNestedField('voice.gender', selected.voice.gender);
                                  updateNestedField('voice.voiceId', selected.voice.voiceId);
                                  updateNestedField('voice.previewUrl', selected.voice.previewUrl);
                                }
                              }}
                              className="w-full px-4 py-2 bg-white/5 cursor-pointer border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>Select Voice</option>
                              {voices.map((voice) => (
                                <option key={voice.id} value={`${voice.voice.name} (${voice.voice.gender})`} style={{ backgroundColor: '#1E1E2D', color: 'white' }}>
                                  {voice.voice.name} ({voice.voice.gender})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* <div className="flex items-center gap-2"> */}
                        {/*   <input */}
                        {/*     type="checkbox" */}
                        {/*     checked={videoData.generateMultipleAngles} */}
                        {/*     onChange={(e) => updateField('generateMultipleAngles', e.target.checked)} */}
                        {/*     className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500" */}
                        {/*   /> */}
                        {/*   <label className="text-sm text-gray-300">Generate Multiple Angles</label> */}
                        {/* </div> */}
                      </div>
                    )}
                  </div>

                  {/* Characters */}
                  <div className="bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl mb-6 border border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleSection('characters')}
                      className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-purple-400" />
                        <h2 className="text-xl font-bold text-white">Characters ({videoData.characters.length})</h2>
                      </div>
                      {expandedSections.characters ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
                    </button>


                    {expandedSections.characters && (
                      <div className="p-6 pt-0 space-y-6">
                        {/* Grid of Character Cards */}
                        <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-6 m-4", videoData.aspectRatio === '16:9' ? 'lg:grid-cols-1' : 'lg:grid-cols-2')}>
                          {videoData.characters.map((character: any, index: number) => (
                            <CharacterCard
                              key={index}
                              index={index}
                              aspectRatio={videoData.aspectRatio}
                              character={character}
                              removeCharacter={removeCharacter}
                              generateCharacterImage={generateCharacterImage}
                              updateNestedField={updateNestedField}
                              modifyPrompts={modifyPrompts}
                              setModifyPrompts={setModifyPrompts}
                              generatingCharacter={generatingCharacter}
                              modifyingCharacter={modifyingCharacter}
                            />
                          ))}
                          {/* Add Character Button */}
                          <div
                            className="min-h-[250px] flex flex-col items-center cursor-pointer justify-center text-muted-foreground bg-white/5 rounded-xl p-4 border border-white/10 hover:text-white"
                            onClick={addCharacter}
                          >
                            <Plus className="w-10 h-10 mb-2" strokeWidth={2} />
                            <span className="text-lg font-medium">Add Character</span>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                </>
              )}

              {/* Scenes */}
              {activeTab === 'Storyline' && (
                <div className="bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl mb-6 border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleSection('scenes')}
                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ImagePlay className="w-5 h-5 text-purple-400" />
                      <h2 className="text-xl font-bold text-white">Scenes ({videoData.scenes.length})</h2>
                    </div>
                    {expandedSections.scenes ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
                  </button>

                  {expandedSections.scenes && (
                    <div className="p-6 pt-0 space-y-6">
                      {/* Grid Layout for Scene Cards */}
                      <div className={cn("grid grid-cols-1 gap-6", videoData.aspectRatio === '16:9' ? 'md:grid-cols-2 lg:grid-cols-1' : 'md:grid-cols-3 lg:grid-cols-2')}>
                        {videoData.scenes.map((scene: any, sceneIndex: number) => (
                          <DraggableSceneCard
                            key={sceneIndex}
                            index={sceneIndex}
                            moveScene={moveScene}>
                            <SceneCard
                              key={sceneIndex}
                              scene={scene}
                              index={sceneIndex}
                              expandedScenes={expandedScenes}
                              expandedAngles={expandedAngles}
                              toggleScene={toggleScene}
                              toggleAngle={toggleAngle}
                              removeScene={removeScene}
                              removeAngle={removeAngle}
                              addAngle={addAngle}
                              updateNestedField={updateNestedField}
                              generatingScene={generatingScene}
                              modifyingScene={generatingScene}
                              generateSceneImage={generateSceneImage}
                              generateSceneVideo={generateSceneVideo}
                              generateSceneAudio={generateSceneAudio}
                              aspectRatio={videoData.aspectRatio}
                              availableCharacters={videoData.characters.map(c => c.name)}
                            />
                          </DraggableSceneCard>
                        ))}
                        <div
                          className={cn(
                            "min-h-[320px] flex flex-col items-center justify-center",
                            "text-muted-foreground bg-white/5 rounded-xl p-6 border border-white/10",
                            "hover:text-white hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all"
                          )}
                          onClick={() => addScene('end')}
                        >
                          <Plus className="w-12 h-12 mb-4" strokeWidth={2} />
                          <span className="text-xl font-semibold">Add New Scene</span>
                          <span className="text-sm mt-2 opacity-70">Click to create a new scene</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Right side - Video Preview (large screens only) */}
            <div className="hidden lg:flex lg:items-start lg:justify-center min-w-[500px]">
              <div className="sticky top-4 w-full h-fit">
                <div className="bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Play className="w-4 h-4 text-purple-400" />
                      Video Preview
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="relative w-full" style={{ aspectRatio: videoData.aspectRatio === '16:9' ? '16/9' : videoData.aspectRatio === '1:1' ? '1/1' : '9/16' }}>
                      {isVideoLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                          </div>
                        </div>
                      ) : localUrl ? (
                        <video
                          src={localUrl}
                          controls
                          loop
                          className="rounded-lg w-full h-full object-contain bg-black"
                        />
                      ) : (
                        <div className="w-full h-full">
                          <VideoPlayer video={videoData} durationInSeconds={Math.round(durationInSeconds)} isSubscribed={!!user?.subscriptionProductId} />
                        </div>
                      )}
                    </div>
                    {!localUrl && (
                      <div className="mt-4">
                        <CaptionStyleControls
                          value={videoData.captionStyle}
                          updateCaptionStyleAction={(newStyle) =>
                            updateField('captionStyle', newStyle)
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={open}
        action={config?.action ?? ""}
        requiredCredits={config?.requiredCredits ?? 0}
        balanceCredits={config?.balanceCredits ?? 0}
        onConfirm={handleConfirm}
      />
    </DndProvider>
  );
};
