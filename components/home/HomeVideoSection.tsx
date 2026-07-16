"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Play } from "lucide-react";

interface HomeVideoSectionProps {
  videoSrc?: string;
  posterSrc?: string;
  title?: string;
}

type Status = "idle" | "loading" | "playing" | "error";

export default function HomeVideoSection({
  videoSrc = "/videos/abstitch-showcase.mp4",
  posterSrc = "/images/video-poster.jpg",
  title = "See Abstitch In Action",
}: HomeVideoSectionProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handlePlay = async () => {
    if (status === "loading" || status === "playing") return;
    setStatus("loading");
    try {
      const res = await fetch(videoSrc);
      if (!res.ok) throw new Error(`Failed to fetch video: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      setBlobUrl(url);
      setStatus("playing");
    } catch (err) {
      console.error("Video load error:", err);
      setStatus("error");
    }
  };

  const isPlaying = status === "playing" && blobUrl;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gray-900"
          style={{ aspectRatio: "16 / 9" }}
        >
          {isPlaying ? (
            <video
              src={blobUrl}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              disabled={status === "loading"}
              aria-label={`Play video: ${title}`}
              className="group absolute inset-0 w-full h-full cursor-pointer disabled:cursor-wait"
            >
              <Image
                src={posterSrc}
                alt={title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {status === "loading" ? (
                    <Loader2
                      size={32}
                      className="text-burgundy-800 animate-spin"
                    />
                  ) : (
                    <Play
                      size={32}
                      className="text-burgundy-800 ml-1"
                      fill="currentColor"
                    />
                  )}
                </div>
              </div>
              {status === "error" && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="inline-block bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                    Couldn&apos;t load the video. Please try again.
                  </span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
