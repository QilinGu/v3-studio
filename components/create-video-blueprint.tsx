'use client'

import { useState, useRef, useEffect } from 'react';
import { Film, PenLine, Music, Mic, Tv, Bot, Gauge, Sparkles, Play, Pause, ChevronRight, ChevronLeft, Check, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import { useAction, useConvex, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { aspectRatioValidator, musicValidator, styleValidator, videoResolutionValidator, voiceValidator } from '@/convex/schema';
import { Infer } from 'convex/values';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useConfirmDialogHook } from '@/hooks/use-confirm-dialog-hook';

interface VoiceType {
  id: number;
  voice: Infer<typeof voiceValidator>;
}

interface MusicType {
  id: number;
  music: Infer<typeof musicValidator>;
}

interface AudioState {
  type: 'music' | 'voice';
  id: number | string;
  url: string;
}

export const CreateVideoBlueprint = ({ tour = false }: { tour?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<number | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<AudioState | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [storyTellingStyle, setStoryTellingStyle] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const tourRef = useRef<ReturnType<typeof driver> | null>(null);
  const [nextButtonTour, setNextButtonTour] = useState<boolean>(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const router = useRouter()
  const convex = useConvex()
  const createVideoBlueprint = useAction(api.video.generateVideoScript.createVideoBlueprint)

  const { open, config, confirm, handleConfirm } = useConfirmDialogHook()

  const user = useQuery(api.user.getUser)

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const styles = [
    { id: 1, name: 'Pixar 3D', image: '/short-video/style/pixar.webp' },
    { id: 2, name: 'Cinematic', image: '/short-video/style/cinematic.webp' },
    { id: 3, name: 'Ghibli', image: '/short-video/style/ghibli.webp' },
    { id: 4, name: 'Anime', image: '/short-video/style/anime.webp' },
    { id: 5, name: 'Cyberpunk', image: '/short-video/style/cyberpunk.webp' },
    { id: 6, name: 'Watercolor', image: '/short-video/style/watercolor.webp' }
  ];

  const aspectRatios = [
    { id: '16:9', label: '16:9', description: 'Landscape' },
    { id: '9:16', label: '9:16', description: 'Portrait' },
  ];

  const models = [
    { id: 'standard', label: 'Standard', description: 'The standard model generates videos without audio and requires narration. Cheaper' },
    { id: 'premium', label: 'Premium', description: 'The premium model provides videos with audio. Uses best in industry video generation models. For subscribed users only' },
  ]

  const resolutions = [
    { id: '480p', label: '480p', description: 'Low quality. Only available in standard model' },
    { id: '720p', label: '720p', description: 'High quality' },
  ]

  const durations = [
    { id: 15, label: '15s', description: 'Quick' },
    { id: 30, label: '30s', description: 'Short' },
    { id: 60, label: '60s', description: 'Standard' },
    { id: 90, label: '90s', description: 'Extended' },
    { id: 120, label: '120s', description: 'Long' },
  ];

  // Generate the array from the music validator's members
  const musics: MusicType[] = musicValidator.members.map((member, index) => ({
    id: index + 1,
    music: {
      title: member.fields.title.value,
      previewUrl: member.fields.previewUrl.value,
    } as Infer<typeof musicValidator>,
  }));


  // Generate the array from the voice validator's members
  const voices: VoiceType[] = voiceValidator.members.map((member, index) => ({
    id: index + 1,
    voice: {
      name: member.fields.name.value,
      gender: member.fields.gender.value,
      voiceId: member.fields.voiceId.value,
      previewUrl: member.fields.previewUrl.value,
    } as Infer<typeof voiceValidator>,
  }));

  const steps = [
    { id: 0, title: 'Prompt', icon: PenLine, color: 'text-pink-500' },
    { id: 1, title: 'Style', icon: Film, color: 'text-purple-500' },
    { id: 2, title: 'Aspect Ratio', icon: Tv, color: 'text-yellow-500' },
    { id: 3, title: 'Duration', icon: Film, color: 'text-orange-500' },
    { id: 4, title: 'AI Model', icon: Bot, color: 'text-indigo-500' },
    { id: 5, title: 'Video Quality', icon: Gauge, color: 'text-emerald-500' },
    // { id: 6, title: 'Story Style', icon: Sparkles, color: 'text-blue-500' },
    { id: 6, title: 'Music', icon: Music, color: 'text-cyan-500' },
    { id: 7, title: 'Voice', icon: Mic, color: 'text-green-500' },
  ];

  const [tourReady, setTourReady] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to match content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 10}px`;
    }
  }, [prompt]);

  // Set tourReady when dialog opens
  useEffect(() => {
    if (isOpen && tour && currentStep === 0) {
      // Delay to allow dialog animation to complete
      const timeoutId = setTimeout(() => {
        setTourReady(true);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, tour, currentStep]);

  // Reset tourReady when step changes
  useEffect(() => {
    setTourReady(false);
  }, [currentStep]);

  // Start tour when animation completes
  useEffect(() => {
    if (!isOpen || !tour || !tourReady || isGeneratingVideo) {
      if (!isOpen) tourRef.current?.destroy();
      return;
    }

    tourRef.current?.destroy();

    if (nextButtonTour) {
      tourRef.current = driver({
        popoverClass: 'driverjs-theme',
        allowClose: false,
        showButtons: [],
      });

      tourRef.current.highlight({
        element: "#next-button",
        popover: {
          title: "Next",
          description: "Click here to move to the next step.",
          side: "top",
          align: "start",
        },
        onHighlightStarted: (element) => {
          element?.addEventListener("click", () => {
            tourRef.current?.destroy();
            setNextButtonTour(false);
          }, { once: true });
        },
      });
    } else {
      tourRef.current = driver({
        popoverClass: 'driverjs-theme',
        allowClose: false,
        showButtons: ['next'],
        onNextClick: () => {
          tourRef.current?.destroy();
          setNextButtonTour(true);
        },
        steps: [
          {
            element: getElementByCurrentStep(currentStep),
            popover: {
              title: getStepTitle(currentStep),
              description: getStepDescription(currentStep),
              side: "top",
              align: "start",
            },
          },
          {
            element: "#next-button",
            popover: {
              title: "Next",
              description: "Click here to move to the next step.",
              side: "top",
              align: "start",
            },
          },
        ]
      });

      tourRef.current.drive();
    }

    return () => {
      tourRef.current?.destroy();
    };
  }, [isOpen, tourReady, nextButtonTour, currentStep, tour, isGeneratingVideo]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
    };
  }, []);

  const toggleAudioPlay = (type: 'music' | 'voice', id: number | string, url: string) => {
    const currentAudioState: AudioState = { type, id, url };

    // If clicking the same audio that's currently playing, pause it
    if (currentlyPlaying && currentlyPlaying.type === type && currentlyPlaying.id === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
      setCurrentlyPlaying(null);
      return;
    }

    // Stop currently playing audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
    }

    // Play new audio
    const audio = new Audio(url);
    audioRef.current = audio;
    setCurrentlyPlaying(currentAudioState);

    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      setCurrentlyPlaying(null);
      audioRef.current = null;
    });

    // Reset when audio ends
    audio.onended = () => {
      setCurrentlyPlaying(null);
      audioRef.current = null;
    };
  };

  // Helper function to check if a specific audio is currently playing
  const isAudioPlaying = (type: 'music' | 'voice', id: number | string) => {
    return currentlyPlaying?.type === type && currentlyPlaying?.id === id;
  };

  const getRandomPrompt = async () => {
    const randomPrompt = await convex.query(api.prompt.getRandomPromptVariation, {
      nounce: Math.random(),
    });

    if (randomPrompt) {
      setPrompt(randomPrompt.prompt);
    }
  };

  const generateVideo = async () => {
    // if (!prompt || !selectedStyle || (selectedMusic === null) || !selectedVoice || !selectedAspectRatio || !selectedDuration || !storyTellingStyle) {
    if (!prompt || !selectedStyle || (selectedMusic === null) || !selectedVoice || !selectedAspectRatio || !selectedDuration) {
      console.log({ prompt, selectedStyle, selectedMusic, selectedVoice, selectedAspectRatio, selectedDuration, storyTellingStyle })
      toast.error('Please fill in all the required fields');
      return;
    }

    try {
      setIsLoading(true);
      setIsGeneratingVideo(true);

      let videoId;

      if (selectedModel === null) {
        toast.error('Please select a model');
        return;
      }

      const confirmConfig = {
        action: 'Generating Video Outline',
        requiredCredits: 5,
        balanceCredits: user?.credits ? user.credits - 5 : 0
      }

      const confirmed = await confirm(confirmConfig)

      console.log('confirmed:', confirmed)

      if (!confirmed) {
        return
      }

      if (selectedMusic === 0) {
        videoId = await createVideoBlueprint({
          prompt,
          style: styles.find(s => s.id === selectedStyle)!.name as Infer<typeof styleValidator>,
          voice: voices.find(s => s.id === selectedVoice)!.voice as Infer<typeof voiceValidator>,
          aspectRatio: aspectRatios.find(s => s.id === selectedAspectRatio)!.label as Infer<typeof aspectRatioValidator>,
          durationInSecs: selectedDuration ?? 15,
          // storyTellingStyle: storyTellingStyle === 'dramatic' ? 'dramatic' : 'default',
          storyTellingStyle: 'default',
          numberOfImagesPerPrompt: 1,
          generateMultipleAngles: false,
          videoGenerationModel: selectedModel === 'premium' ?
            { model: 'google/veo-3.1-fast', audio: 'lipsync', category: 'premium', } :
            { model: 'wan-video/wan-2.2-i2v-fast', audio: 'none', category: 'standard', },
          resolution: resolutions.find(s => s.id === selectedResolution)!.label as Infer<typeof videoResolutionValidator>,
        });
      } else {
        videoId = await createVideoBlueprint({
          prompt,
          style: styles.find(s => s.id === selectedStyle)!.name as Infer<typeof styleValidator>,
          music: musics.find(s => s.id === selectedMusic)!.music as Infer<typeof musicValidator>,
          voice: voices.find(s => s.id === selectedVoice)!.voice as Infer<typeof voiceValidator>,
          aspectRatio: aspectRatios.find(s => s.id === selectedAspectRatio)!.label as Infer<typeof aspectRatioValidator>,
          durationInSecs: selectedDuration ?? 15,
          // storyTellingStyle: storyTellingStyle === 'dramatic' ? 'dramatic' : 'default',
          storyTellingStyle: 'default',
          numberOfImagesPerPrompt: 1,
          generateMultipleAngles: false,
          videoGenerationModel: selectedModel === 'premium' ?
            { model: 'google/veo-3.1-fast', audio: 'lipsync', category: 'premium', } :
            { model: 'wan-video/wan-2.2-i2v-fast', audio: 'none', category: 'standard', },
          resolution: resolutions.find(s => s.id === selectedResolution)!.label as Infer<typeof videoResolutionValidator>,
        });
      }

      if (tour) {
        router.push(`/ai-tools/ai-video/editor/${videoId}?tour=true`)
      } else {
        router.push(`/ai-tools/ai-video/editor/${videoId}`);
      }
    } catch (error) {
      toast.error('An error occurred while connecting to the backend');
    } finally {
      setIsLoading(false);
      setIsGeneratingVideo(false);
      setPrompt('');
      setSelectedStyle(null);
      setSelectedMusic(null);
      setSelectedVoice(null);
      setSelectedAspectRatio(null);
      setSelectedDuration(null);
      setStoryTellingStyle(null);
      setIsOpen(false);
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return prompt.trim().length > 0;
      case 1: return selectedStyle !== null;
      case 2: return selectedAspectRatio !== null;
      case 3: return selectedDuration !== null;
      case 4: return selectedModel !== null;
      case 5: return selectedResolution !== null;
      // case 6: return storyTellingStyle !== null;
      case 6: return selectedMusic !== null;
      case 7: return selectedVoice !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setPrompt('');
    setSelectedStyle(null);
    setSelectedMusic(null);
    setSelectedVoice(null);
    setSelectedAspectRatio(null);
    setSelectedDuration(null);
    setStoryTellingStyle(null);
    setSelectedModel(null);
    setSelectedResolution(null);
    setNextButtonTour(false)
    setTourReady(false)
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
  };

  const renderStepContent = () => {
    const CurrentIcon = steps[currentStep].icon;

    return (
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="w-full"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("p-3 rounded-full bg-gradient-to-br",
                currentStep === 0 && "from-pink-500/20 to-pink-600/20",
                currentStep === 1 && "from-purple-500/20 to-purple-600/20",
                currentStep === 2 && "from-yellow-500/20 to-yellow-600/20",
                currentStep === 3 && "from-orange-500/20 to-orange-600/20",
                currentStep === 4 && "from-indigo-500/20 to-indigo-600/20",
                currentStep === 5 && "from-emerald-500/20 to-emerald-600/20",
                currentStep === 6 && "from-blue-500/20 to-blue-600/20",
                currentStep === 7 && "from-cyan-500/20 to-cyan-600/20",
                currentStep === 8 && "from-green-500/20 to-green-600/20"
              )}>
                <CurrentIcon className={cn("w-6 h-6", steps[currentStep].color)} />
              </div>
              <div>
                <h2 className={cn("text-2xl font-bold", steps[currentStep].color)}>{steps[currentStep].title}</h2>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-[400px]">
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onAnimationComplete={() => {
                  // Set tourReady after animation completes
                  setTimeout(() => setTourReady(true), 0);
                }}
              >
                {/* Prompt Section */}
                <p className="text-muted-foreground mb-4">
                  Describe the video you want to create. Be specific about the scenes, mood, and story.
                </p>
                <div
                  id='write-video-prompt'
                  className="space-y-4">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full min-h-[200px] bg-secondary/50 border border-border rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    placeholder="Example: A peaceful morning in a fantasy forest with sunlight filtering through the trees, magical creatures awakening..."
                  />
                  <div className="flex justify-start items-center mb-4">
                    <button
                      onClick={getRandomPrompt}
                      className="flex items-center gap-2 px-4 py-2 border border-zinc-700 cursor-pointer rounded-md hover:bg-zinc-800 transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Prompt Writer
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onAnimationComplete={() => {
                  // Set tourReady after animation completes
                  setTimeout(() => setTourReady(true), 0);
                }}
                id='story-style-section'
              >
                {/* Video Style Section */}
                <p className="text-muted-foreground mb-4">
                  Choose a visual style that matches your video&apos;s aesthetic.
                </p>
                <div
                  className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-auto">
                  {styles.map((style, index) => (
                    <motion.div
                      key={style.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedStyle(style.id)}
                      className={cn(
                        "relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                        selectedStyle === style.id ? 'border-green-500 ring-2 ring-purple-500/50' : 'border-border'
                      )}
                    >
                      <div
                        className="relative rounded-lg overflow-hidden bg-black">
                        <Image
                          alt={style.name}
                          loading="lazy"
                          width={400}
                          height={300}
                          className="w-full aspect-video object-cover rounded-lg"
                          src={style.image}
                        />
                        <h2 className="absolute bottom-0 w-full text-white text-sm font-medium bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                          {style.name}
                        </h2>
                      </div>
                      {selectedStyle === style.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-green-500 rounded-full p-1"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onAnimationComplete={() => {
                  // Set tourReady after animation completes
                  setTimeout(() => setTourReady(true), 0);
                }}
                id='aspect-ratio-section'
              >
                {/* Aspect Ratio Section */}
                <p className="text-muted-foreground mb-4">
                  Select the aspect ratio for your video output.
                </p>
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {aspectRatios.map((ratio, index) => (
                    <motion.button
                      key={ratio.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedAspectRatio(ratio.id)}
                      className={cn(
                        "relative p-8 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer",
                        selectedAspectRatio === ratio.id
                          ? 'border-yellow-500 bg-yellow-500/10 ring-2 ring-yellow-500/50'
                          : 'border-border bg-secondary/50'
                      )}
                    >
                      <div className="text-center">
                        <p className="text-3xl font-bold mb-2">{ratio.label}</p>
                        <p className="text-sm text-muted-foreground">{ratio.description}</p>
                      </div>
                      {selectedAspectRatio === ratio.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onAnimationComplete={() => {
                  // Set tourReady after animation completes
                  setTimeout(() => setTourReady(true), 0);
                }}
                id='duration-section'
              >
                {/* Duration Section */}
                <p className="text-muted-foreground mb-4">
                  Set the length of your video
                </p>
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {durations.map((duration, index) => (
                    <motion.button
                      key={duration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedDuration(duration.id)}
                      className={cn(
                        "relative p-6 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer",
                        selectedDuration === duration.id
                          ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/50'
                          : 'border-border bg-secondary/50'
                      )}
                    >
                      <div className="text-center">
                        <p className="text-2xl font-bold mb-1">{duration.label}</p>
                        <p className="text-xs text-muted-foreground">{duration.description}</p>
                      </div>
                      {selectedDuration === duration.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-orange-500 rounded-full p-1"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onAnimationComplete={() => {
                  // Set tourReady after animation completes
                  setTimeout(() => setTourReady(true), 0);
                }}
                id='ai-model-section'
              >
                {/* AI Model Section */}
                <p className="text-muted-foreground mb-4">
                  Select the AI model to use for generating the video.
                </p>
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {models.map((model, index) => (
                    <motion.button
                      key={model.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      disabled={model.id === 'premium' && !user?.subscriptionProductId}
                      onClick={() => {
                        if (model.id === 'premium' && selectedResolution === '480p') {
                          setSelectedResolution('720p')
                        }
                        setSelectedModel(model.id)
                      }}
                      className={cn(
                        "relative p-8 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer",
                        selectedModel === model.id
                          ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/50'
                          : 'border-border bg-secondary/50',
                        model.id === 'premium' && !user?.subscriptionProductId && "opacity-50 cursor-not-allowed pointer-events-none grayscale"
                      )}
                    >
                      <div className="text-center">
                        <p className="text-3xl font-bold mb-2">{model.label}</p>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                      </div>
                      {selectedModel === model.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onAnimationComplete={() => {
                  // Set tourReady after animation completes
                  setTimeout(() => setTourReady(true), 0);
                }}
                id='video-quality-section'
              >
                {/* Video Quality Section */}
                <p className="text-muted-foreground mb-4">
                  Select the resolution for your video output.
                </p>
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {resolutions.map((resolution, index) => (
                    <motion.button
                      key={resolution.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      disabled={selectedModel === 'premium' && resolution.id === '480p'}
                      onClick={() => setSelectedResolution(resolution.id)}
                      className={cn(
                        "relative p-8 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer",
                        selectedResolution === resolution.id
                          ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/50'
                          : 'border-border bg-secondary/50',
                        selectedModel === 'premium' && resolution.id === '480p' && "opacity-50 cursor-not-allowed pointer-events-none grayscale"
                      )}
                    >
                      <div className="text-center">
                        <p className="text-3xl font-bold mb-2">{resolution.label}</p>
                        <p className="text-sm text-muted-foreground">{resolution.description}</p>
                      </div>
                      {selectedResolution === resolution.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* {currentStep === 6 && ( */}
            {/*   <motion.div */}
            {/*     initial={{ opacity: 0, y: 20 }} */}
            {/*     animate={{ opacity: 1, y: 0 }} */}
            {/*     transition={{ delay: 0.1 }} */}
            {/*     onAnimationComplete={() => { */}
            {/*       // Set tourReady after animation completes */}
            {/*       setTimeout(() => setTourReady(true), 0); */}
            {/*     }} */}
            {/*     id='story-telling-style-section' */}
            {/*   > */}
            {/*     {/* Storytelling Style Section */}
            {/*     <p className="text-muted-foreground mb-4"> */}
            {/*       Choose the storytelling approach for your video. */}
            {/*     </p> */}
            {/*     <div */}
            {/*       className="grid grid-cols-2 gap-4 max-w-md mx-auto"> */}
            {/*       {['default', 'dramatic'].map((style, index) => ( */}
            {/*         <motion.button */}
            {/*           key={style} */}
            {/*           initial={{ opacity: 0, y: 20 }} */}
            {/*           animate={{ opacity: 1, y: 0 }} */}
            {/*           transition={{ delay: index * 0.1 }} */}
            {/*           onClick={() => setStoryTellingStyle(style)} */}
            {/*           className={cn( */}
            {/*             "relative p-8 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer", */}
            {/*             storyTellingStyle === style */}
            {/*               ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/50' */}
            {/*               : 'border-border bg-secondary/50' */}
            {/*           )} */}
            {/*         > */}
            {/*           <div className="text-center"> */}
            {/*             <p className="text-xl font-bold mb-2 capitalize">{style}</p> */}
            {/*             <p className="text-xs text-muted-foreground"> */}
            {/*               {style === 'default' ? 'Balanced pacing' : 'Intense & engaging'} */}
            {/*             </p> */}
            {/*           </div> */}
            {/*           {storyTellingStyle === style && ( */}
            {/*             <motion.div */}
            {/*               initial={{ scale: 0 }} */}
            {/*               animate={{ scale: 1 }} */}
            {/*               className="absolute top-2 right-2 bg-blue-500 rounded-full p-1" */}
            {/*             > */}
            {/*               <Check className="w-4 h-4 text-white" /> */}
            {/*             </motion.div> */}
            {/*           )} */}
            {/*         </motion.button> */}
            {/*       ))} */}
            {/*     </div> */}
            {/*   </motion.div> */}
            {/* )} */}

            {currentStep === 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onAnimationComplete={() => {
                  // Set tourReady after animation completes
                  setTimeout(() => setTourReady(true), 0);
                }}
                id='music-section'
              >
                {/* Background Music Section */}
                <p className="text-muted-foreground mb-4">
                  Select background music to set the mood.
                </p>
                <div
                  className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 }}
                    onClick={() => setSelectedMusic(0)}
                    className={cn(
                      "relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105",
                      selectedMusic === 0
                        ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/50'
                        : 'border-border bg-secondary/50'
                    )}
                  >
                    <div className="flex-1">
                      <p className="font-semibold">None</p>
                    </div>
                    {selectedMusic === 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 bg-cyan-500 rounded-full p-1"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </ motion.div>
                  {musics.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index + 1) * 0.05 }}
                      onClick={() => setSelectedMusic(track.id)}
                      className={cn(
                        "relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105",
                        selectedMusic === track.id
                          ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/50'
                          : 'border-border bg-secondary/50'
                      )}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAudioPlay('music', track.id, track.music.previewUrl)
                        }}
                        className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition flex-shrink-0"
                      >
                        {isAudioPlaying('music', track.id) ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold">{track.music.title}</p>
                      </div>
                      {selectedMusic === track.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-cyan-500 rounded-full p-1"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </ motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 7 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onAnimationComplete={() => {
                  // Set tourReady after animation completes
                  setTimeout(() => setTourReady(true), 0);
                }}
                id='voice-section'
              >
                {/* Voiceover Section */}
                <p className="text-muted-foreground mb-4">
                  Choose a voice for the narration.
                </p>
                <div
                  className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-auto">
                  {voices.map((voice, index) => (
                    <motion.div
                      key={voice.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={cn(
                        "relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105",
                        selectedVoice === voice.id
                          ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/50'
                          : 'border-border bg-secondary/50'
                      )}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAudioPlay('voice', voice.voice.voiceId, voice.voice.previewUrl);
                        }}
                        className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition flex-shrink-0"
                      >
                        {isAudioPlaying('voice', voice.voice.voiceId) ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold">{voice.voice.name}</p>
                        <p className="text-sm text-muted-foreground">{voice.voice.gender}</p>
                      </div>
                      {selectedVoice === voice.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-green-500 rounded-full p-1"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="bg-background p-4">
      <Button
        onClick={() => {
          setIsOpen(true);
          resetWizard();
        }}
        size="lg"
        className={cn(
          "relative mx-4 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500",
          "disabled:pointer-events-none disabled:opacity-50",
          "h-9 py-2 px-5 rounded-md text-white overflow-hidden",
          "bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-[length:200%_100%]",
          "hover:scale-105 active:scale-95 transition-all duration-300",
          "shadow-lg shadow-pink-500/50 hover:shadow-xl hover:shadow-pink-500/70",
          "animate-shimmer"
        )}
        style={{
          animation: "shimmer 3s linear infinite"
        }}
      >
        <Film className="w-5 h-5 mr-2" />
        Create AI Video
        <style jsx>{`
              @keyframes shimmer {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
              }
            `}</style>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={cn("max-w-[95svw] lg:max-w-[1200px] xl:max-w-[1400px] max-h-[90svh] overflow-auto p-0 bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] backdrop-blur-xl border-zinc-800")}>
        {/* <DialogContent className={cn("max-w-[95svw] max-h-[90svh] overflow-auto p-0 bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] backdrop-blur-xl border-zinc-800")}> */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-red-500">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Film className="w-6 h-6" />
              Create Your AI Video
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Section - Main Wizard */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Progress Bar */}
              <div className="hidden md:block px-6 pt-6 pb-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                          index < currentStep && "bg-green-500 text-white",
                          index === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                          index > currentStep && "bg-muted text-muted-foreground"
                        )}
                      >
                        {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "w-12 h-1 mx-1 transition-all",
                            index < currentStep ? "bg-green-500" : "bg-muted"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 bg-zinc-900/50">
                {renderStepContent()}
              </div>

              {/* Footer */}
              <div className="border-t px-6 py-4 bg-slate-600/30">
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleBack();
                      paginate(-1);
                    }}
                    disabled={currentStep === 0 || isLoading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button
                      onClick={generateVideo}
                      disabled={!canProceed()}
                      className="bg-red-500 hover:to-purple-700 text-white"
                      id='next-button'
                    >
                      {isLoading ? <Spinner /> : <Sparkles className="w-6 h-6" />}
                      {isLoading ? 'Generating...' : 'Generate Outline'}
                    </Button>
                  ) : (
                    <Button
                      id='next-button'
                      onClick={() => {
                        handleNext();
                        paginate(1);
                      }}
                      disabled={!canProceed() || isLoading}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Sample Video Preview - Only visible on lg screens and up */}
             <div className="hidden lg:flex lg:w-80 xl:w-96 items-center justify-center p-4 border-l border-zinc-800 bg-zinc-900/30"> 
             <div className="w-full h-full max-h-[70vh] aspect-[9/16] bg-zinc-800/50 rounded-lg border border-zinc-700 flex items-center justify-center overflow-hidden"> 
            {selectedStyle ? ( 
             <div className="w-full h-full flex items-center justify-center"> 
                     <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center"> 
                       <Play className="w-8 h-8 text-pink-500" /> 
                     </div> 
                </div> 
               ) : ( */}
                <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center"> 
                    <Film className="w-8 h-8 text-zinc-500" /> 
                 </div> 
               )} 
             </div> 
             </div> 
          </div>
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <LoaderCircle className="h-8 w-8 animate-spin" />
                <p className="text-lg font-medium">Generating Video Outline...</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={open}
        action={config?.action ?? ""}
        requiredCredits={config?.requiredCredits ?? 0}
        balanceCredits={config?.balanceCredits ?? 0}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

const getElementByCurrentStep = (currentStep: number) => {
  const stepElements = [
    '#write-video-prompt',      // Step 0
    '#story-style-section',     // Step 1
    '#aspect-ratio-section',    // Step 2
    '#duration-section',        // Step 3
    '#ai-model-section',        // Step 4
    '#video-quality-section',   // Step 5
    // '#story-telling-style-section', // Step 6
    '#music-section',           // Step 7
    '#voice-section',           // Step 8
  ];
  return stepElements[currentStep] || stepElements[0];
}

// Helper functions for dynamic content
const getStepTitle = (step: number) => {
  const titles = [
    "Write your video idea",
    "Choose your style",
    "Select aspect ratio",
    "Set duration",
    "Choose AI model",
    "Select quality",
    // "Pick story style",
    "Add background music",
    "Choose voice"
  ];
  return titles[step] || "Complete this step";
};

const getStepDescription = (step: number) => {
  const descriptions = [
    "Write your video idea in the text area. You can click on the AI prompt writer to generate a random prompt.",
    "Select the visual style that matches your video's aesthetic.",
    "Choose the aspect ratio for your video output.",
    "Set the length of your video.",
    "Select the AI model for video generation.",
    "Choose the resolution for your video.",
    // "Select your storytelling approach.",
    "Pick background music to set the mood.",
    "Choose a voice for narration."
  ];
  return descriptions[step] || "Follow the instructions to complete this step.";
};
