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
    question: "What are Clarity and Confidence Strategies?",
    answer:
      "Clarity and Confidence Strategies are techniques designed to help you communicate more effectively and feel more self-assured in various situations. These strategies include methods for organizing your thoughts, improving your body language, and developing a positive mindset.",
  },
  {
    question: "How do you go from theory to practice?",
    answer:
      "Going from theory to practice involves actively applying what you've learned. Start by setting small, achievable goals, and gradually increase the complexity of your tasks. Regular practice, seeking feedback, and reflecting on your experiences are key to bridging the gap between theoretical knowledge and practical application.",
  },
  {
    question: "How can workshops help you grow?",
    answer:
      "Workshops provide hands-on learning experiences that can accelerate your growth. They offer opportunities to learn from experts, practice new skills in a supportive environment, receive immediate feedback, and network with peers. Workshops can also expose you to new perspectives and innovative techniques in your field.",
  },
  {
    question: "What is the ultimate guide to hosting NFTs?",
    answer:
      "The ultimate guide to hosting NFTs covers all aspects of creating, minting, and managing Non-Fungible Tokens. It includes choosing the right blockchain, setting up a digital wallet, selecting an NFT marketplace, understanding gas fees, creating compelling metadata, and marketing your NFTs effectively. The guide also addresses legal considerations and best practices for protecting your digital assets.",
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
