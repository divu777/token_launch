"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import Image from "next/image";
import CardImg2 from "../../../public/hero2.jpg";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 2.5 }, // Increased delay
    }),
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100">
      <div ref={ref} className="flex justify-center items-center h-2/3 pt-24">
        <div className="w-1/2 flex justify-end">
          <div className="relative h-[600px] w-4/5 overflow-hidden rounded-lg">
            <motion.div
              initial={{ top: 0 }}
              animate={isInView ? { top: "100%" } : { top: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              className="absolute inset-x-0 bg-slate-100 z-10"
              style={{ height: "100%" }}
            />
            <Image
              src={CardImg2}
              alt="Card Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="w-1/2 pl-16 space-y-8">
          <motion.h2
            className="text-4xl font-bold tracking-wide"
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            SIMPLE AND TIMELESS
          </motion.h2>
          <motion.p
            className="text-lg leading-relaxed text-gray-700"
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae quis
            accusamus dignissimos voluptatem commodi odit molestiae dolore
            ratione dolor molestias laborum quam beatae mollitia perferendis,
            odio itaque aperiam explicabo? A.
          </motion.p>
        </div>
      </div>
      <div className="flex justify-center w-full items-end text-5xl pb-24 mt-24">
        <h1 className="w-4/5 font-semibold leading-tight">
          {[
            "DISCOVER",
            "EVERYDAY",
            "ESSENTIALS",
            "DESIGNED",
            "FOR",
            "A",
            "BLEND",
            "OF",
            "COMFORT",
            "AND",
            "ELEGANCE.",
          ].map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={staggerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="inline-block mr-2"
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </div>
    </div>
  );
}
