"use client";

import { useState } from "react";

export default function FaqAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div id="faqList">
      {items.map((f, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={`faq-item${isOpen ? " open" : ""}`} key={i}>
            <button
              className="faq-q"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{f.question}</span>
              <span className="plus">+</span>
            </button>
            <div className="faq-a" style={{ maxHeight: isOpen ? "600px" : "0" }}>
              <p>{f.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
