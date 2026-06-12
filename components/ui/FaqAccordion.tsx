"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={faq.q}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-sans font-semibold text-sm text-gray-900">
              {faq.q}
            </span>
            <span
              className={`text-burgundy-800 font-bold text-xl leading-none flex-shrink-0 transition-transform duration-200 ${
                openIndex === i ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 border-t border-gray-50">
              <p className="font-sans text-sm text-gray-500 leading-relaxed pt-3">
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}