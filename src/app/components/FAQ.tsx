"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [

  {
    question: "What’s next after this?",
    answer:
      "Well, brace yourself! After this, I might dive into the deep, mysterious waters of C programming, hacking, and maybe even chip-making. Just kidding! That’s way too technical for me! Instead, I’m looking to swim into the finance sector, focusing on transaction handling. Who knows, I might just stumble upon a startup idea that’ll make me the next tech billionaire! Let’s see what ideas float to the surface—hopefully not like a sinking ship!",
  },
  {
    question: "Why Devnet and not Mainnet?",
    answer:
      "Ah, the beauty of Devnet! It’s like the training wheels of the blockchain world. Why go straight to Mainnet and risk a heart attack when you can play around in Devnet without the pressure? Here, you can mint tokens, test smart contracts, and break things without the fear of losing real money. It's the perfect playground for experimentation—plus, it’s free! Just think of it as a ‘sandbox’ where you can unleash your inner crypto wizard without any adult supervision.",
  },
  {
    question: "Why projects in every field and why not focus on just one field and master it?",
    answer:
      "100% agree, dude! What I really enjoy is experimenting with how things work under the hood. With this project, I even tried to make it using the CLI after watching Harkirat's video ages ago, but honestly, I didn’t get it back then. At that time, I was just a copy-paste dev, thinking, ‘Let it be!’ But now, exploring different fields keeps the creativity flowing and helps you stumble upon those ‘aha!’ moments. Who knows what cool things you might discover when you step outside your comfort zone?",
  },
  {
    question: "How did it take you one month to complete this project?",
    answer:
      "Ah, the classic tale of ‘Bina chappal bhaag ke dikkat karli!’ With zero experience in Solana, I jumped into the wild world of instructions, figuring out how adapters work and how authentication dances with UI components. Let me tell you, there were moments of pure genius mixed with a lot of head-scratching. After wrestling with the code, troubleshooting errors, and maybe even questioning my life choices, I finally emerged victorious! It’s safe to say that frustration was my best friend, and I might just write a memoir titled ‘From Confusion to Clarity: My Solana Saga.’",
  },
];


export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl font-bold mb-12 text-gray-900 text-center">
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
            >
              <button
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleQuestion(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-xl font-semibold text-gray-900 pr-8">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-6 w-6 text-blue-500" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    key={`answer-${index}`}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                  >
                    <div
                      className="p-6 text-gray-700 bg-gray-50 border-t border-gray-200 text-lg leading-relaxed"
                      id={`faq-answer-${index}`}
                    >
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
