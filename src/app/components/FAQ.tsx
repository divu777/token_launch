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

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-12 text-gray-900">
        Frequently Asked Questions
      </h1>
      <div className="w-full max-w-3xl space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <button
              className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
              onClick={() => toggleQuestion(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-lg font-medium text-gray-900">
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-5 w-5 text-gray-500" />
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
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div
                    className="p-4 text-gray-700 bg-gray-50"
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
  );
};

export default FAQ;
