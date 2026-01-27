'use client'

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import VideoCard from '@/components/ai-tools/ai-videos/video-card';
import { CreateVideoBlueprint } from '@/components/create-video-blueprint';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Doc } from '@/convex/_generated/dataModel';

export const UsersVideosList = () => {

  const searchParams = useSearchParams();

  const videos = useQuery(api.video.video.getVideos)

  const tour = searchParams.get('tour') === 'true';

  const tourRef = useRef<ReturnType<typeof driver> | null>(null);

  const isMobile = window.innerWidth < 768; // md breakpoint

  const elementId = isMobile ? "#create-ai-video-button-mobile" : "#create-ai-video-button";

  useEffect(() => {
    if (tour) {
      tourRef.current = driver({
        popoverClass: 'driverjs-theme',
        allowClose: false,
      });

      tourRef.current?.highlight({
        element: elementId,
        popover: {
          title: "Create AI Powered Video",
          description:
            "Click here to generate your first AI video.",
          side: "bottom",
          align: "start",
        },
      });

      // Add click listener to close tour when button is clicked
      const button = document.querySelector(elementId);
      const handleClick = () => {
        tourRef.current?.destroy();
      };

      if (button) {
        button.addEventListener("click", handleClick);
      }

      // Cleanup
      return () => {
        if (button) {
          button.removeEventListener("click", handleClick);
        }
        tourRef.current?.destroy();
      };
    }
  }, [elementId, tour, videos]);

  return (
    <div>
      <div>
        {/* Page header */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-2xl mb-2 mt-5">My Videos</h2>
          <div
            id='create-ai-video-button'
            className="hidden md:flex items-center gap-5">
            <CreateVideoBlueprint tour={tour} />
          </div>
        </div>

        {/* Empty state */}
        {videos && videos?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-400 border rounded-2xl p-10">
            <Image
              alt="No projects illustration"
              draggable={false}
              loading="lazy"
              width={100}
              height={100}
              className="w-[100px] mb-6 select-none pointer-events-none"
              src="/short-video.webp"
            />
            <p className="text-lg mb-2">You have no projects yet.</p>
            <p className="max-w-sm">
              Start creating your first AI Powered Video to bring your ideas to life!
            </p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5'>
          {videos && videos.map((video: Doc<'videos'>, index: number) => (
            <div key={index}
            >
              <VideoCard video={video} index={index} />
            </div>
          ))}
        </div>
        <div
          id='create-ai-video-button-mobile'
          className="md:hidden mx-auto w-fit gap-5">
          <CreateVideoBlueprint tour={tour} />
        </div>

        {/* Loading state */}
        {videos === undefined &&
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500 text-lg">Loading your videos...</p>
          </div>
        }

      </div>
    </div >
  )
}
