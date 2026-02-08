'use client';

import { useState } from 'react';

type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-primary-200 rounded-lg overflow-hidden"
        >
          <button
            type="button"
            className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-primary-800 hover:bg-primary-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            {item.question}
            <span className={`transform transition-transform ${openIndex === i ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {openIndex === i && (
            <div className="px-4 py-3 bg-primary-50 text-primary-700 border-t border-primary-200">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
