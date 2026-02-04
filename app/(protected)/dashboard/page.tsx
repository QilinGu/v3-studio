"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect, useRef } from "react";
import { useState } from "react";

export default function DashboardPage() {

  const tourRef = useRef<ReturnType<typeof driver> | null>(null);
  const user = useQuery(api.user.getUser)

  const [tour, setTour] = useState(false);

   /*
  const seedPrompt = useMutation(api.prompt.seedPrompt)

  const removePromptVariationDuplicates = useMutation(api.prompt.removePromptVariationDuplicates)


  useEffect(() => {
    const seedAllPrompts = async () => {
      try {
        // Sequential version (safer, avoids rate limits)
        for (const [category, prompts] of Object.entries(promptVariations)) {
          for (const prompt of prompts) {
            await seedPrompt({ prompt, category });
          }
        }

        await removePromptVariationDuplicates();

        console.log("✅ All prompts seeded successfully!");
      } catch (err) {
        console.error("❌ Error seeding prompts:", err);
      }
    };

    seedAllPrompts();
  }, [seedPrompt, removePromptVariationDuplicates]);

*/
  
  useEffect(() => {
    tourRef.current = driver({
      popoverClass: 'driverjs-theme',
      allowClose: false,
    });
  }, []);

  if (tour) {
    tourRef.current?.highlight({
      element: "#start-creating-button",
      popover: {
        title: "Start here 👋",
        description:
          "Click here to generate your first AI video. We'll guide you step by step.",
        side: "bottom",
        align: "start",
      },
      onHighlightStarted: (element) => {
        element?.addEventListener("click", () => {
          tourRef.current?.destroy();
        }, { once: true });
      },
    });
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-5 mb-8">
        <div className="flex-1 p-6 bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl shadow-md border border-white/10">
          <h2 className="font-bold text-2xl text-white flex items-center gap-2">
            🎬 AI Movie Magic
          </h2>
          <p className="text-gray-300 mt-2 leading-relaxed">
            Lights, camera, AI! 🚀 Instantly transform your text or images into stunning cinematic videos. Create stories that move — literally.
          </p>
          
          {/* Improved button layout with clear visual hierarchy */}
          <div className="flex flex-wrap justify-between items-center gap-3 mt-5">
            {/* Primary CTA - Bold and prominent */}
            <Link href={
              tour
                ? { pathname: "/ai-tools/ai-video", query: { tour: 'true' } }
                : { pathname: "/ai-tools/ai-video" }
            }>
              <Button
                id="start-creating-button"
                className="
                  px-6 py-2.5
                  bg-gradient-to-r from-[#45EC82] to-[#75CEFC]
                  text-black
                  font-semibold
                  shadow-lg shadow-[#45EC82]/30
                  hover:shadow-xl hover:shadow-[#45EC82]/40
                  hover:scale-[1.03]
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                ✨ Start Creating
              </Button>
            </Link>

            {/* Secondary action - Subtle text link style */}
            <button
              onClick={() => setTour(true)}
              className="
                group
                flex items-center gap-1.5
                px-3 py-2
                text-sm
                text-yellow-400
                hover:text-yellow-500
                hover:cursor-pointer
                transition-colors duration-200
              "
            >
              <svg 
                className="w-4 h-4 opacity-100 transition-opacity" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Take a guided tour
            </button>
          </div>
        </div>

        {!user?.subscriptionProductId && (
          <div className="flex-1 p-6 bg-gradient-to-r from-[#2D2F36] via-[#202227] to-[#1B1C20] rounded-xl shadow-md border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                🔥 Unlock Pro Features
              </h3>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                Get <span className="font-semibold text-white">exclusive tools</span>, <span className="font-semibold text-white">faster rendering</span>, and <span className="font-semibold text-white">higher usage limits</span>.
                <br />
                Upgrade now and save <span className="font-bold text-yellow-400">20%</span> 🎉
              </p>
            </div>
            <Link href="/billing">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 shadow-md hover:shadow-yellow-500/30 transition-all">
                🚀 Upgrade Now
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Storyboard Feature */}
        <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <Image
            alt="Storyboard Your Ideas with AI"
            className="w-full h-72 object-cover"
            src="/dashboard/1.webp"
            width={600}
            height={288}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <h3 className="text-white font-bold text-lg">Storyboard Your Ideas with AI</h3>
            <p className="text-white text-sm opacity-70">
              Instantly turn your script or idea into a visual storyboard powered by AI. Perfect for pre-production planning.
            </p>
          </div>
        </div>

        {/* Movie Maker Feature */}
        <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <Image
            alt="One-Click AI Movie Maker"
            className="w-full h-72 object-cover"
            src="/dashboard/2.webp"
            width={600}
            height={288}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <h3 className="text-white font-bold text-lg">One-Click AI Movie Maker</h3>
            <p className="text-white text-sm opacity-70">
              Create cinematic-quality video scenes in seconds with intelligent automation and stunning visuals.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Three Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI Reels Creator */}
        <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <Image
            alt="AI Reels & Shorts Creator"
            className="w-full h-72 object-cover"
            src="/dashboard/3.webp"
            width={400}
            height={288}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <h3 className="text-white font-bold text-lg">AI Reels & Shorts Creator</h3>
            <p className="text-white text-sm opacity-70">
              Produce engaging short-form videos using AI-powered editing and transitions.
            </p>
          </div>
        </div>

        {/* AI Ad Creator */}
        <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <Image
            alt="Instant AI Ad Creator"
            className="w-full h-72 object-cover"
            src="/dashboard/4.webp"
            width={400}
            height={288}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <h3 className="text-white font-bold text-lg">Instant AI Ad Creator</h3>
            <p className="text-white text-sm opacity-70">
              Generate high-converting, professional-grade video ads with cutting-edge AI.
            </p>
          </div>
        </div>

        {/* AI Product Scene Generator */}
        <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <Image
            alt="AI Product Scene Generator"
            className="w-full h-72 object-cover"
            src="/dashboard/5.webp"
            width={400}
            height={288}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <h3 className="text-white font-bold text-lg">AI Product Scene Generator</h3>
            <p className="text-white text-sm opacity-70">
              Create cinematic product visuals with AI generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
