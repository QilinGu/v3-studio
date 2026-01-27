"use client";

import { Button } from "@/components/ui/button";
import TemplateCard, { Template } from "@/components/template-card";
import {
  Heart,
  Baby,
  PawPrint,
  Sparkles,
  Swords,
} from "lucide-react";
import Link from "next/link";

const templates: Template[] = [
  {
    id: "animal-encounters",
    title: "Wildlife Animal Encounters",
    description: "Dramatic BBC Earth style wildlife documentaries showing animals engaging with other animals. Cinematic, photorealistic footage with intense action.",
    icon: <Swords className="h-8 w-8 text-orange-400" />,
    category: "Wildlife Documentary",
    examplePrompt: "Generate a unique, dramatic wildlife encounter between any two animals in their natural habitat. Choose different species each time - predators, prey, or unexpected encounters. Create a fresh scenario with unique animals, locations, and outcomes. The encounter should be intense, visually stunning, and tell a complete story of survival, competition, or coexistence in the wild.",
    trending: true,
    sampleVideoUrl: "https://cdn.v3-studio.com/4hrm7foqkb/out.mp4",
  },
  {
    id: "human-rescuing-animals",
    title: "Human Rescuing Animals",
    description: "Heartwarming stories of humans saving animals in distress. Perfect for emotional, viral content that touches hearts.",
    icon: <Heart className="h-8 w-8 text-red-400" />,
    category: "Rescue Stories",
    examplePrompt: "Generate a unique, heartwarming rescue story. Choose any animal in distress - it could be a puppy, kitten, bird, deer, or any creature. Create a fresh scenario: trapped somewhere, injured, abandoned, or in danger. The rescuer could be anyone - a passerby, firefighter, child, or elderly person. Make each story original with different animals, situations, and emotional journeys from rescue to recovery.",
    trending: true,
    sampleVideoUrl: "https://cdn.v3-studio.com/4hrm7foqkb/out.mp4",
  },
  {
    id: "animal-asking-help",
    title: "Animals Seeking Help",
    description: "Touching tales of animals approaching humans for help to save their babies or partners. Emotional storytelling at its best.",
    icon: <PawPrint className="h-8 w-8 text-amber-400" />,
    category: "Animal Stories",
    examplePrompt: "Generate a unique story about an animal desperately seeking human help. Choose any animal - cat, dog, bird, fox, or other creature. Their loved ones could be trapped, injured, or in danger. Create a fresh scenario each time: babies stuck somewhere, partner hurt, family separated. Show the animal's intelligence and persistence in communicating their need, leading to a heartwarming rescue and reunion.",
    trending: true,
    sampleVideoUrl: "https://cdn.v3-studio.com/4hrm7foqkb/out.mp4",
  },
  {
    id: "animal-saving-humans",
    title: "Animals Saving Humans",
    description: "Incredible stories of brave animals protecting and saving human babies or adults. Shows the beautiful bond between species.",
    icon: <Baby className="h-8 w-8 text-blue-400" />,
    category: "Hero Animals",
    examplePrompt: "Generate a unique hero animal story. Choose any protective animal - dog, cat, horse, dolphin, or other creature. The danger could be anything: a predator, fire, intruder, natural disaster, or accident. The human could be a baby, child, elderly person, or anyone vulnerable. Create a fresh scenario showing the animal's bravery, quick thinking, and selfless protection that saves a life.",
    sampleVideoUrl: "https://cdn.v3-studio.com/4hrm7foqkb/out.mp4",
  },
  {
    id: "animal-friendship",
    title: "Unlikely Animal Friends",
    description: "Adorable stories of unexpected friendships between different animal species. Wholesome content that spreads joy.",
    icon: <Sparkles className="h-8 w-8 text-purple-400" />,
    category: "Friendship",
    examplePrompt: "Generate a unique unlikely friendship story between two different animal species. Choose any combination: dog and duck, cat and rabbit, horse and goat, lion and dog, elephant and sheep, or any surprising pair. One might be orphaned, lonely, or new. Create a fresh story showing how they meet, overcome their differences, and become inseparable best friends.",
    sampleVideoUrl: "https://cdn.v3-studio.com/4hrm7foqkb/out.mp4",
  },
  {
    id: "lost-pet-reunion",
    title: "Lost Pet Reunions",
    description: "Emotional reunion stories of pets finding their way back home or being reunited with their owners after years.",
    icon: <Heart className="h-8 w-8 text-pink-400" />,
    category: "Reunion Stories",
    examplePrompt: "Generate a unique lost pet reunion story. Choose any pet - dog, cat, bird, or other beloved animal. They could have been lost for days, months, or years. Create a fresh scenario: how they got separated (storm, accident, stolen, wandered off), the family's grief and hope, and the miraculous reunion. Each story should have different circumstances, time apart, and emotional reunion moments.",
    sampleVideoUrl: "https://cdn.v3-studio.com/4hrm7foqkb/out.mp4",
  },
  {
    id: "stray-transformation",
    title: "Stray Transformations",
    description: "Before and after stories of stray animals being rescued, rehabilitated, and transformed with love and care.",
    icon: <Sparkles className="h-8 w-8 text-green-400" />,
    category: "Transformation",
    examplePrompt: "Generate a unique stray animal transformation story. Choose any neglected animal - dog, cat, horse, or other creature. Their condition could vary: severely matted, malnourished, injured, or terrified. Create a fresh scenario with different rescuers, care journeys, and stunning before-and-after transformations. Show the physical and emotional healing as they find their forever home.",
    sampleVideoUrl: "https://cdn.v3-studio.com/4hrm7foqkb/out.mp4",
  },
];

export default function TemplatesPage() {
  return (
    <div className="max-w-full mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="p-6 bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl shadow-md border border-white/10">
          <h1 className="font-bold text-3xl text-white flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            Video Templates
          </h1>
          <p className="text-gray-300 mt-3 leading-relaxed max-w-2xl">
            Choose from our curated collection of viral video templates. Each template is optimized for
            short-form content (9:16) and designed to create engaging, emotional stories that resonate with audiences.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              All templates are 9:16 aspect ratio
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Optimized for TikTok, Reels & Shorts
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {templates.map((template, index) => (
          <TemplateCard key={template.id} template={template} index={index} />
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-12 p-6 bg-gradient-to-r from-[#2D2F36] via-[#202227] to-[#1B1C20] rounded-xl border border-white/10 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">More Templates Coming Soon</h3>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          We&apos;re constantly adding new viral video templates. Have a suggestion?
          Let us know what kind of content you&apos;d like to create!
        </p>
        <Link href="/contact-us">
          <Button variant="outline" className="mt-4 border-white/20 hover:bg-white/10">
            Suggest a Template
          </Button>
        </Link>
      </div>
    </div>
  );
}
