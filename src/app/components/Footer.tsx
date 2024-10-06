"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const letters = "DIVAKAR".split("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <footer className="bg-black text-white flex flex-col justify-between items-center">
      <div className="max-w-6xl w-full flex flex-col justify-between items-center py-10 px-4">
        <div className="text-center mb-12">
          <p className="text-purple-400 text-sm mb-2">For general queries</p>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            contact@divakar.com
          </h2>
        </div>

        <nav className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-12">
          <Link
            href="/about"
            className="font-semibold hover:text-gray-300 transition-colors"
          >
            ABOUT
          </Link>
          <Link
            href="/marketplace"
            className="font-semibold hover:text-gray-300 transition-colors"
          >
            MARKETPLACE
          </Link>
          <Link
            href="/how-it-works"
            className="font-semibold hover:text-gray-300 transition-colors"
          >
            HOW IT WORKS
          </Link>
          <Link
            href="/collection"
            className="font-semibold hover:text-gray-300 transition-colors"
          >
            GENERATOR
          </Link>
        </nav>
      </div>

      <div className="w-full">
        <div
          ref={ref}
          className="text-center pb-10 border-b border-solid border-white overflow-hidden"
        >
          <div className="flex justify-center items-center">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: "110%" }}
                animate={isInView ? { y: 0 } : { y: "100%" }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.6, 0.01, -0.05, 0.9],
                }}
                className="text-7xl sm:text-9xl lg:text-[10rem] font-bold text-blue-600 inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-evenly gap-6 items-center py-10 px-4">
          <Link
            href="https://github.com"
            className="border border-white rounded-full px-6 py-3 text-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            GITHUB
          </Link>
          <Link
            href="https://linkedin.com"
            className="border border-white rounded-full px-6 py-3 text-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            LINKEDIN
          </Link>
          <Link
            href="https://twitter.com"
            className="border border-white rounded-full px-6 py-3 text-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            TWITTER
          </Link>
        </div>
      </div>
    </footer>
  );
}
