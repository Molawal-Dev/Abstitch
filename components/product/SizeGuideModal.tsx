"use client";

import { useState, useRef, useEffect  } from "react";
import { X, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import type { SizeGuide } from "@/types";

interface SizeGuideModalProps {
  sizeGuide: SizeGuide;
  description?: string;
}

export default function SizeGuideModal({ sizeGuide, description }: SizeGuideModalProps) {
  const [open, setOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const el = scrollRef.current;
      if (el) setIsScrollable(el.scrollWidth > el.clientWidth);
    }, 100);
    return () => clearTimeout(timer);
  }, [open]);

  const nudge = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 150 : -150, behavior: "smooth" });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-md text-burgundy-800 hover:underline font-medium mt-4"
      >
        <Ruler size={14} />
        Size Guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Size Guide"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-burgundy-50">
              <div>
                <h2 className="font-serif text-xl font-bold text-burgundy-900">
                  {sizeGuide.title || "Size Guide"}
                </h2>
                <p className="font-sans text-xs text-gray-500 mt-0.5">
                  All measurements are approximate. When in doubt, size up.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-burgundy-100 text-gray-500 hover:text-burgundy-800 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {isScrollable && (
                <div className="flex items-center justify-between gap-3 px-6 py-2 bg-blue-50 border-b border-blue-100">
                  <p className="font-sans text-xs text-blue-700 flex items-center gap-1.5">
                    <span>👈</span>
                    Scroll left or right to see the full table
                    <span>👉</span>
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => nudge("left")}
                      className="w-7 h-7 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => nudge("right")}
                      className="w-7 h-7 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="overflow-auto flex-1 p-6">
                {sizeGuide.notes ? (
                  <div
                    className="rich-content text-sm"
                    dangerouslySetInnerHTML={{ __html: sizeGuide.notes }}
                  />
                ) : description ? (
                  <div
                    className="rich-content text-sm"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <p className="font-sans text-sm text-gray-400 italic">
                    No size guide content available.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="font-sans text-xs text-gray-500">
                Not sure about your size? Contact us at{" "}
                <a
                  href="mailto:info@abstitch.co.uk"
                  className="text-burgundy-700 hover:underline"
                >
                  info@abstitch.co.uk
                </a>
              </p>
              <button
                onClick={() => setOpen(false)}
                className="btn-primary py-2 px-5 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
