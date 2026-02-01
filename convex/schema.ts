import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const voiceValidator = v.union(
  // extra voices
  v.object({ name: v.literal('Clyde'), gender: v.literal('Male'), voiceId: v.literal('2EiwWnXFnvU5JabPnv8n'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/2EiwWnXFnvU5JabPnv8n/65d80f52-703f-4cae-a91d-75d4e200ed02.mp3'), }),
  // premium voices
  v.object({ name: v.literal('Matilda'), gender: v.literal('Female'), voiceId: v.literal('NihRgaLj2HWAjvZ5XNxl'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/custom/voices/NihRgaLj2HWAjvZ5XNxl/OrIdbMk7IHZvEOEVlsQ0.mp3'), }),
  v.object({ name: v.literal('Angela'), gender: v.literal('Female'), voiceId: v.literal('FUfBrNit0NNZAwb58KWH'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/database/user/gRajrUNCrhb72wl6XOG7GGnJafF2/voices/FUfBrNit0NNZAwb58KWH/qR9BgJbJgFt0IooAGDBx.mp3'), }),
  v.object({ name: v.literal('Cindy'), gender: v.literal('Female'), voiceId: v.literal('iCrDUkL56s3C8sCRl7wb'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/database/user/sD92HnMHS9WZLXKNTKxmnC8XmJ32/voices/iCrDUkL56s3C8sCRl7wb/CYu7JBN3ynOLysW29clt.mp3'), }),
  v.object({ name: v.literal('Amelia'), gender: v.literal('Female'), voiceId: v.literal('ZF6FPAbjXT4488VcRRnw'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/custom/voices/ZF6FPAbjXT4488VcRRnw/PXswrdJcgsGr8VdoVA43.mp3'), }),
  v.object({ name: v.literal('Caroline'), gender: v.literal('Female'), voiceId: v.literal('tnSpp4vdxKPjI9w0GnoV'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/custom/voices/tnSpp4vdxKPjI9w0GnoV/LiIyxRT1qFJ1QJPr8sWl.mp3'), }),
  v.object({ name: v.literal('Professor Bill'), gender: v.literal('Male'), voiceId: v.literal('lnieQLGTodpbhjpZtg1k'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/database/user/D24IGF9ntveLHjWUaVzVpcPora82/voices/lnieQLGTodpbhjpZtg1k/c7c51a49-a9d8-4594-ab34-d7051b826a9a.mp3'), }),
  v.object({ name: v.literal('Drew'), gender: v.literal('Male'), voiceId: v.literal('Qdoacjdd3OKJ1mMc318A'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/database/user/ORe3NGzEcpVLmf1lPgP435AC7Px2/voices/Qdoacjdd3OKJ1mMc318A/dPmXOB8hf460JbO9Jaek.mp3'), }),
  v.object({ name: v.literal('Mark'), gender: v.literal('Male'), voiceId: v.literal('UgBBYS2sOqTuMpoF3BR0'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/database/workspace/f94e260200764678babc807b935bfb0b/voices/UgBBYS2sOqTuMpoF3BR0/0Oc7jiXwWN9kRTXfQsmw.mp3'), }),
  v.object({ name: v.literal('Jonathan'), gender: v.literal('Male'), voiceId: v.literal('PIGsltMj3gFMR34aFDI3'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/database/workspace/ae5cf0d6fb064897b39505ab5988252a/voices/PIGsltMj3gFMR34aFDI3/YwBlqdNO99mqRJj1CJ5b.mp3'), }),
  v.object({ name: v.literal('Christine'), gender: v.literal('Female'), voiceId: v.literal('uYXf8XasLslADfZ2MB4u'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/database/user/sD92HnMHS9WZLXKNTKxmnC8XmJ32/voices/uYXf8XasLslADfZ2MB4u/M0UTfNFigInhz8LMb4DA.mp3'), }),
  v.object({ name: v.literal('Roger'), gender: v.literal('Male'), voiceId: v.literal('CwhRBWXzGAHq8TQ4Fs17'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3'), }),
  v.object({ name: v.literal('Sarah'), gender: v.literal('Female'), voiceId: v.literal('EXAVITQu4vr4xnSDxMaL'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'), }),
  v.object({ name: v.literal('Laura'), gender: v.literal('Female'), voiceId: v.literal('FGY2WhTYpPnrIDTdsKH5'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3'), }),
  v.object({ name: v.literal('Charlie'), gender: v.literal('Male'), voiceId: v.literal('IKne3meq5aSn9XLyUdCD'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3'), }),
  v.object({ name: v.literal('George'), gender: v.literal('Male'), voiceId: v.literal('JBFqnCBsd6RMkjVDRZzb'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3'), }),
  v.object({ name: v.literal('Callum'), gender: v.literal('Male'), voiceId: v.literal('N2lVS1w4EtoT3dr4eOWO'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3'), }),
  v.object({ name: v.literal('Bill'), gender: v.literal('Male'), voiceId: v.literal('pqHfZKP75CvOlQylNhV4'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3'), }),
  v.object({ name: v.literal('Lily'), gender: v.literal('Female'), voiceId: v.literal('pFZP5JQG7iQjIQuC4Bku'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'), }),
  v.object({ name: v.literal('River'), gender: v.literal('Female'), voiceId: v.literal('SAz9YHcvj6GT2YYXdXww'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3'), }),
  v.object({ name: v.literal('Harry'), gender: v.literal('Male'), voiceId: v.literal('SOYHLrjzK2X1ezoPC6cr'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3'), }),
  v.object({ name: v.literal('Liam'), gender: v.literal('Male'), voiceId: v.literal('TX3LPaxmHKxFdv7VOQHJ'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3'), }),
  v.object({ name: v.literal('Chris'), gender: v.literal('Male'), voiceId: v.literal('iP95p4xoKVk53GoZ742B'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/iP95p4xoKVk53GoZ742B/3f4bde72-cc48-40dd-829f-57fbf906f4d7.mp3'), }),
  v.object({ name: v.literal('Will'), gender: v.literal('Male'), voiceId: v.literal('bIHbv24MWmeRgasZH58o'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3'), }),
  v.object({ name: v.literal('Jessica'), gender: v.literal('Female'), voiceId: v.literal('cgSgspJ2msm6clMCkdW9'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3'), }),
  v.object({ name: v.literal('Brian'), gender: v.literal('Male'), voiceId: v.literal('nPczCjzI2devNBz1zQrb'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd3e72c-4fd3-42f1-93ea-abc5d4e5aa1d.mp3'), }),
  v.object({ name: v.literal('Daniel'), gender: v.literal('Male'), voiceId: v.literal('onwK4e9ZLuTAKqWW03F9'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3'), }),
  v.object({ name: v.literal('Alice'), gender: v.literal('Female'), voiceId: v.literal('Xb7hH8MSUJpSbSDYk0k2'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3'), }),
  v.object({ name: v.literal('Eric'), gender: v.literal('Male'), voiceId: v.literal('cjVigY5qzO86Huf0OWal'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/d098fda0-6456-4030-b3d8-63aa048c9070.mp3'), }),
  v.object({ name: v.literal('Adam'), gender: v.literal('Male'), voiceId: v.literal('pNInz6obpgDQGcFmaJgB'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3'), }),
)

export const styleValidator = v.union(
  v.literal('Pixar 3D'),
  v.literal('Cinematic'),
  v.literal('Ghibli'),
  v.literal('Anime'),
  v.literal('Cyberpunk'),
  v.literal('Watercolor'),
)

export const videoResolutionValidator = v.union(
  v.literal('480p'),
  v.literal('720p'),
)

export const musicValidator = v.union(
  v.object({ title: v.literal('Dark Tranquility'), previewUrl: v.literal('https://happysoulmusic.com/wp-content/grand-media/audio/Dark_Tranquility_-_Anno_Domini_Beats.mp3'), }),
  v.object({ title: v.literal('Intentions'), previewUrl: v.literal('https://debb-bucket.s3.ap-south-1.amazonaws.com/background_music/Intentions+-+Anno+Domini+Beats.mp3'), }),
  v.object({ title: v.literal('Blade Runner'), previewUrl: v.literal('https://debb-bucket.s3.ap-south-1.amazonaws.com/background_music/blade_runner_2049.mp3'), }),
  v.object({ title: v.literal('Matrix'), previewUrl: v.literal('https://debb-bucket.s3.ap-south-1.amazonaws.com/background_music/memories.mp3'), }),
  v.object({ title: v.literal('Welcome Beats'), previewUrl: v.literal('https://debb-bucket.s3.ap-south-1.amazonaws.com/background_music/Welcome+-+Anno+Domini+Beats.mp3'), }),
  v.object({ title: v.literal('Beats'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/11/11/audio_f2cf114879.mp3'), }),
  v.object({ title: v.literal('Future Bass'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/11/08/audio_05b10daae7.mp3'), }),
  v.object({ title: v.literal('Upbeat'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/11/07/audio_a9bc5df6b9.mp3'), }),
  v.object({ title: v.literal('Chill'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/10/23/audio_fc19d0fae0.mp3'), }),
  v.object({ title: v.literal('Electronic'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/07/28/audio_944c8a9cde.mp3'), }),
  v.object({ title: v.literal('Chill Hip Hop'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/07/01/audio_546ec56e2a.mp3'), }),
  v.object({ title: v.literal('Pop'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/02/13/audio_851cb5db32.mp3'), }),
  v.object({ title: v.literal('Chill Electronic'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/02/13/audio_38278d96ea.mp3'), }),
  v.object({ title: v.literal('Chill Pop'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/02/02/audio_9c1cf8951d.mp3'), }),
  v.object({ title: v.literal('Future Beats'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/01/25/audio_8698bda9da.mp3'), }),
  v.object({ title: v.literal('Chill Beats'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/01/02/audio_c88a26ff39.mp3'), }),
)

export const videoGenerationModelSchema = v.union(
  v.object({ model: v.literal('wan-video/wan-2.2-i2v-fast'), audio: v.literal('none'), category: v.literal('standard'), }),
  v.object({ model: v.literal('openai/sora-2'), audio: v.literal('lipsync'), category: v.literal('premium'), }),
  v.object({ model: v.literal('wan-video/wan-2.5-i2v'), audio: v.literal('background'), category: v.literal('premium'), }),
  v.object({ model: v.literal('google/veo-3.1-fast'), audio: v.literal('lipsync'), category: v.literal('premium'), }),
  v.object({ model: v.literal('google/veo-3.1'), audio: v.literal('lipsync'), category: v.literal('premium'), }),
  v.object({ model: v.literal('google/veo-3'), audio: v.literal('lipsync'), category: v.literal('premium'), }),
  v.object({ model: v.literal('google/veo-3-fast'), audio: v.literal('lipsync'), category: v.literal('premium'), }),
  v.object({ model: v.literal('openai/sora-2-pro'), audio: v.literal('lipsync'), category: v.literal('premium'), }),
  v.object({ model: v.literal('bytedance/seedance-1-pro'), audio: v.literal('none'), category: v.literal('standard'), }),
  v.object({ model: v.literal('bytedance/seedance-1-lite'), audio: v.literal('none'), category: v.literal('standard'), }),
)

// Video aspect ratios
export const aspectRatioValidator = v.union(
  v.literal('16:9'),
  v.literal('9:16'),
  v.literal('1:1'),
)

export const characterSchema = v.object({
  name: v.string(),
  imagePrompt: v.string(),
  voiceProfile: v.optional(v.string()),
  imageStorageId: v.optional(v.id('_storage')),
  imageUrl: v.optional(v.string()),
  inProcess: v.optional(v.boolean()),
})

export const wordSchema = v.object({
  text: v.string(),
  startMs: v.number(),
  endMs: v.number(),
})

export const angleSchema = v.object({
  index: v.number(),
  angleVideoPrompt: v.string(),
  angleVideoUrl: v.optional(v.string()),
})

export const sceneSchema = v.object({
  index: v.number(),
  imagePrompt: v.string(),
  videoPrompt: v.string(),
  charactersInTheScene: v.optional(v.array(v.string())),
  imageId: v.optional(v.id('_storage')),
  imageUrl: v.optional(v.string()),
  imageInProcess: v.optional(v.boolean()),
  videoId: v.optional(v.id('_storage')),
  videoUrl: v.optional(v.string()),
  videoDurationInSeconds: v.optional(v.number()),
  videoInProcess: v.optional(v.boolean()),

  angles: v.optional(v.array(angleSchema)),

  narration: v.optional(v.string()),

  words: v.optional(v.array(wordSchema)),

  audioId: v.optional(v.id('_storage')),
  audioUrl: v.optional(v.string()),
  audioInProcess: v.optional(v.boolean()),
})

export const captionStyleSchema = v.object({
  textColor: v.string(), // CSS color value
  backgroundColor: v.string(), // CSS color value
  backgroundOpacity: v.number(), // 0-1
  textSize: v.union(
    v.literal('1.5rem'),
    v.literal('2rem'),
    v.literal('2.5rem'),
    v.literal('3rem'),
    v.literal('3.5rem'),
    v.literal('4rem'),
    v.literal('4.5rem'),
    v.literal('5rem')
  ),
  position: v.union(
    v.literal('top'),
    v.literal('middle'),
    v.literal('bottom')
  ),
  showBackground: v.boolean(),
  textAlign: v.optional(v.union(
    v.literal('left'),
    v.literal('center'),
    v.literal('right')
  )),
  fontWeight: v.optional(v.union(
    v.literal('400'),
    v.literal('500'),
    v.literal('600'),
    v.literal('700'),
    v.literal('800'),
    v.literal('900')
  )),
  wordsPerBatch: v.optional(v.union(
    v.literal(1),   // Single word
    v.literal(2),   // Two words
    v.literal(3),   // Three words
    v.literal(4),   // Four words
    v.literal(5)    // Five words
  )),
  textTransform: v.optional(v.union(
    v.literal('none'),
    v.literal('uppercase'),
    v.literal('lowercase'),
    v.literal('capitalize')
  )),
  transitionStyle: v.optional(v.union(
    v.literal('none'),
    v.literal('fade'),
    v.literal('scale'),
    v.literal('slide-up'),
    v.literal('slide-down')
  )),
  fontFamily: v.optional(v.union(
    v.literal('Komika'),
    v.literal('Pacifico'),
    v.literal('Bangers'),
    v.literal('Coiny'),
    v.literal('Komika'),
  )),
  bgCurrentWord: v.optional(v.boolean()),
  currentWordBounce: v.optional(v.boolean()),
  showCaption: v.optional(v.boolean()),
  // Advanced styling - stores additional CSS properties as JSON string
  advancedStyle: v.optional(v.string())
});

export default defineSchema({
  users: defineTable({
    name: v.string(),
    credits: v.number(),
    subject: v.string(),
    email: v.optional(v.string()),
    polarCustomerId: v.string(),
    subscriptionProductId: v.optional(v.string()),
    onboardingDone: v.optional(v.boolean()),
    isAdmin: v.optional(v.boolean()),
  }).index('by_subject', ['subject']),

  ads: defineTable({
    userId: v.id('users'),
    productId: v.id('_storage'),
    productUrl: v.string(),
    description: v.optional(v.string()),
    avatar: v.optional(v.string()),
    aspectRatio: v.optional(aspectRatioValidator),
    adImageStorageId: v.optional(v.id('_storage')),
    adImageUrl: v.optional(v.string()),
    adVideoStorageId: v.optional(v.id('_storage')),
    adVideoUrl: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  suggestions: defineTable({
    userId: v.id('users'),
    fullName: v.string(),
    email: v.string(),
    subject: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index('by_userId', ['userId'])
    .index('by_createdAt', ['createdAt']),

  promptVariations: defineTable({
    category: v.string(), // e.g., "randomAiStory", "scaryStay", etc.
    prompt: v.string(), // prompt variations
  }).index("by_category", ["category"]),
  orders: defineTable({
    userId: v.id('users'),
    orderId: v.string(),
  }).index('by_orderId', ['orderId']),

  videos: defineTable({
    userId: v.id('users'),

    templateId: v.optional(v.string()),

    autoGenerate: v.optional(v.boolean()),
    autoGenerateError: v.optional(v.string()),
    prompt: v.string(),
    title: v.optional(v.string()),
    style: styleValidator,
    music: v.optional(musicValidator),
    voice: voiceValidator,
    durationInSecs: v.number(), // Total video length in seconds
    aspectRatio: aspectRatioValidator,
    resolution: v.optional(videoResolutionValidator),

    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),

    characters: v.array(characterSchema),
    scenes: v.array(sceneSchema),

    captionStyle: v.optional(captionStyleSchema),

    storyTellingStyle: v.optional(v.union(v.literal('default'), v.literal('dramatic'))),

    videoGenerationModel: v.optional(videoGenerationModelSchema),

    // Error handling
    error: v.optional(v.object({
      message: v.string(),
      step: v.string(),
      timestamp: v.number(),
    })),

    // Generation settings
    numberOfImagesPerPrompt: v.number(), // How many variations to generate
    generateMultipleAngles: v.boolean(), // Whether to create extra angles

    // Rendering settings
    renderId: v.optional(v.string()),
    bucketName: v.optional(v.string()),

    // Usage tracking
    creditsUsed: v.optional(v.number()),
    imagesGenerated: v.optional(v.number()),
    videosGenerated: v.optional(v.number()),
  })
    .index('by_userId', ['userId'])
})


// Create a TypeScript type from your validator
export type CaptionStyleType = Infer<typeof captionStyleSchema>;

// Preset configurations
export const CAPTION_PRESETS: Record<string, CaptionStyleType> = {
  tiktok: {
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    backgroundOpacity: 0,
    showBackground: false,
    textSize: '4rem' as const,
    fontWeight: '900' as const,
    textTransform: 'uppercase' as const,
    position: 'middle' as const,
    textAlign: 'center' as const,
    wordsPerBatch: 2,
    transitionStyle: 'scale' as const,
    fontFamily: 'Coiny',
    showCaption: true,
    bgCurrentWord: true,
    currentWordBounce: false,
  },

  youtubeShorts: {
    textColor: '#FFCD00',
    backgroundColor: 'transparent',
    backgroundOpacity: 0,
    showBackground: false,
    textSize: '3.5rem' as const,  // 13px in the original, but keeping your rem size
    fontWeight: '900' as const,
    textTransform: 'capitalize' as const,
    position: 'middle' as const,
    textAlign: 'center' as const,
    wordsPerBatch: 1,
    transitionStyle: 'scale' as const,
    fontFamily: 'Komika',  // Added Komika font family
    showCaption: true,
    bgCurrentWord: false,
    currentWordBounce: true,
    advancedStyle: JSON.stringify({
      textShadow: '0.1em 0.1em 0.1em #000, 0.1em -0.1em 0.1em #000, -0.1em 0.1em 0.1em #000, -0.1em -0.1em 0.1em #000, 0.1em 0.1em 0.2em #000, 0.1em -0.1em 0.2em #000, -0.1em 0.1em 0.2em #000, -0.1em -0.1em 0.2em #000, 0px 0px 0.1em #000, 0px 0px 0.2em #000, 0px 0px 0.3em #000, 0px 0px 0.4em #000, 0px 0px 0.5em #000, 0px 0px 0.6em #000',
      padding: '5px 10px',
      borderRadius: '10px',
      letterSpacing: 'normal',  // Explicitly set to match original
      lineHeight: 'normal'  // Explicitly set to match original
    })
  },

  instagramReels: {
    textColor: '#FFCD00',
    backgroundColor: '#000000',
    backgroundOpacity: 0.7,
    showBackground: true,
    textSize: '3rem' as const,
    fontWeight: '700' as const,
    textTransform: 'none' as const,
    position: 'bottom' as const,
    textAlign: 'center' as const,
    wordsPerBatch: 3,
    transitionStyle: 'fade' as const,
    fontFamily: 'Coiny' as const,
    showCaption: true,
    bgCurrentWord: true,
    currentWordBounce: false,
  },

  classic: {
    textColor: '#FFCD00',
    backgroundColor: '#000000',
    backgroundOpacity: 0.8,
    showBackground: true,
    textSize: '2rem' as const,
    fontWeight: '600' as const,
    textTransform: 'none' as const,
    position: 'bottom' as const,
    textAlign: 'center' as const,
    wordsPerBatch: 5,
    transitionStyle: 'none' as const,
    fontFamily: 'Pacifico',
    showCaption: true,
    bgCurrentWord: true,
    currentWordBounce: false,
  },

  minimal: {
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    backgroundOpacity: 0,
    showBackground: false,
    textSize: '3rem' as const,
    fontWeight: '500' as const,
    textTransform: 'none' as const,
    position: 'middle' as const,
    textAlign: 'center' as const,
    wordsPerBatch: 1,
    transitionStyle: 'fade' as const,
    fontFamily: 'Bangers',
    showCaption: true,
    bgCurrentWord: true,
    currentWordBounce: false,
  }
} as const;

// arrays generated from schema
export const videoGenerationModelArray = v.array(videoGenerationModelSchema);
export const aspectRatioArray = v.array(aspectRatioValidator);
export const styleArray = v.array(styleValidator);
export const voiceArray = v.array(voiceValidator);
export const musicArray = v.array(musicValidator);
export const videoResolutionArray = v.array(videoResolutionValidator);
