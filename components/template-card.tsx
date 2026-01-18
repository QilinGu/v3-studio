'use client'

import { useRef, useState } from "react"
import { Play, Pause, TrendingUp, Clock, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAction, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useConfirmDialogHook } from "@/hooks/use-confirm-dialog-hook"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Infer } from "convex/values"
import { styleValidator, voiceValidator, musicValidator, aspectRatioValidator, videoResolutionValidator } from "@/convex/schema"

export type Template = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
  examplePrompt: string
  trending?: boolean
  sampleVideoUrl?: string
}

// Pre-defined parameters for template-based video generation
export interface TemplateVideoParams {
  templateId: string
  prompt: string
  style: Infer<typeof styleValidator>
  voice: Infer<typeof voiceValidator>
  music?: Infer<typeof musicValidator>
  aspectRatio: Infer<typeof aspectRatioValidator>
  durationInSecs: number
  resolution: Infer<typeof videoResolutionValidator>
  videoGenerationModel: {
    model: string
    audio: string
    category: 'standard' | 'premium'
  }
}

// Default pre-defined parameters for template-based video generation
const DEFAULT_TEMPLATE_PARAMS = {
  style: 'Cinematic' as Infer<typeof styleValidator>,
  voice: {
    name: 'Brian' as const,
    gender: 'Male' as const,
    voiceId: 'nPczCjzI2devNBz1zQrb' as const,
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd3e72c-4fd3-42f1-93ea-abc5d4e5aa1d.mp3' as const,
  } as Infer<typeof voiceValidator>,
  aspectRatio: '9:16' as Infer<typeof aspectRatioValidator>,
  durationInSecs: 15,
  resolution: '720p' as Infer<typeof videoResolutionValidator>,
  videoGenerationModel: {
    model: 'google/veo-3-fast' as const,
    audio: 'lipsync' as const,
    category: 'premium' as const,
  },
}

export default function TemplateCard({ template, index }: { template: Template; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const createVideoBlueprint = useAction(api.video.generateVideoScript.createVideoBlueprint)
  const user = useQuery(api.user.getUser)
  const { open, config, confirm, handleConfirm } = useConfirmDialogHook()

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (videoRef.current && template.sampleVideoUrl) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  /**
   * Generates a video from a template with pre-defined parameters.
   * The user cannot modify any of the parameters - everything is pre-configured.
   *
   * @param templateId - The ID of the template being used
   * @param prompt - The prompt from the template's examplePrompt
   */
  const generateVideoFromTemplate = async (templateId: string, prompt: string) => {
    try {
      setIsLoading(true)

      const confirmConfig = {
        action: 'Generating Video Outline from Template',
        requiredCredits: 5,
        balanceCredits: user?.credits ? user.credits - 5 : 0
      }

      const confirmed = await confirm(confirmConfig)

      if (!confirmed) {
        setIsLoading(false)
        return
      }

      // All parameters are pre-defined - user cannot change them
      const videoId = await createVideoBlueprint({
        templateId,
        prompt,
        style: DEFAULT_TEMPLATE_PARAMS.style,
        music: DEFAULT_TEMPLATE_PARAMS.music,
        voice: DEFAULT_TEMPLATE_PARAMS.voice,
        aspectRatio: DEFAULT_TEMPLATE_PARAMS.aspectRatio,
        durationInSecs: DEFAULT_TEMPLATE_PARAMS.durationInSecs,
        storyTellingStyle: 'default',
        numberOfImagesPerPrompt: 1,
        generateMultipleAngles: false,
        videoGenerationModel: DEFAULT_TEMPLATE_PARAMS.videoGenerationModel,
        resolution: DEFAULT_TEMPLATE_PARAMS.resolution,
      })

      // Navigate to the video editor page
      router.push(`/ai-tools/ai-video/editor/${videoId}`)
    } catch (error) {
      console.error('Error generating video from template:', error)
      toast.error('An error occurred while generating the video')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key={index}
      whileHover={{ scale: 1.02 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="group relative rounded-xl overflow-hidden cursor-pointer border border-white/10 shadow-sm bg-gradient-to-br from-[#1E1E2D] via-[#1A1A24] to-[#101014] hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trending Badge */}
      {template.trending && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          <TrendingUp className="h-3 w-3" />
          Trending
        </div>
      )}

      {/* Video Container - 9:16 Aspect Ratio */}
      <div className="relative aspect-[9/16] w-full bg-black/50">
        {template.sampleVideoUrl ? (
          <>
            <video
              ref={videoRef}
              src={template.sampleVideoUrl}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              preload="metadata"
            />
            {/* Play/Pause Overlay Button */}
            <button
              onClick={togglePlayPause}
              className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isHovered && isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                }`}
            >
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </div>
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">
            <div className="p-4 bg-white/5 rounded-full mb-3">
              {template.icon}
            </div>
            <p className="text-sm text-gray-400">Preview coming soon</p>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-purple-300 uppercase tracking-wider font-medium">
              {template.category}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Clock className="h-3 w-3" />
              <span>9:16</span>
            </div>
          </div>
          <h3 className="text-white font-semibold text-lg leading-tight mb-2">
            {template.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2 mb-3">
            {template.description}
          </p>
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white gap-2"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              generateVideoFromTemplate(template.id, template.examplePrompt)
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Use Template
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-sm font-medium text-white">Generating Video...</p>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={open}
        action={config?.action ?? ""}
        requiredCredits={config?.requiredCredits ?? 0}
        balanceCredits={config?.balanceCredits ?? 0}
        onConfirm={handleConfirm}
      />
    </motion.div>
  )
}
