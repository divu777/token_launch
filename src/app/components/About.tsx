"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import Image from "next/image";
import CardImg2 from "../../../public/hero2.jpg";
import { Button } from "@/components/ui/button";

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
      transition: { delay: i * 0.1 + 2.5 },
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
              src="https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmZrrNy1Mma5e3EL9nckc9y7rneyPkvZfjvdaXir1xZrb2"
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
            Dive into the Solana Minting Adventure! 🚀
          </motion.h2>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <motion.p
            className="text-md leading-relaxed text-gray-700 w-2/3"
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
            Welcome to the wild world of Solana! Ready to unleash your inner
            &quot;Modi Ji&quot; and mint some digital treasures? Here&apos;s how
            it works:
            <br />
            <br />
            First, you&apos;ll create a Mint Account after interacting with a
            Solana contract—think of it as your magic ticket to print more
            tokens! But here&apos;s the twist: instead of landing straight in
            your wallet, your tokens head to an Associated Token Account (ATA)
            that holds your shiny new assets.
            <br />
            <br />
            Next, you&apos;ll want to jazz things up with metadata! Using cool
            services like IFSC and Pinata, you can upload and pin your metadata
            to keep it safe and sound in the vast digital cosmos. It&apos;s a
            little behind-the-scenes magic that ensures your creations stand the
            test of time.
            <br />
            <br />
            Oh, and don&apos;t forget: if you&apos;re experimenting in Devnet,
            you&apos;ll need those precious Devnet tokens from the Solana
            faucet. They&apos;re just waiting for you to snag &apos;em and start your
            minting journey!
            <br />
            <br />
            Pro Tip: Avoid using popular NFT images like the Chimpunks. While
            they may work, you might run into some restrictions on creation. If
            you&apos;ve got the inside scoop, hit me up on Twitter! Let&apos;s
            learn together! 🐦✨
          </motion.p>
         
        </div>
      </div>
      <div className="flex justify-center w-full items-end text-5xl pb-24 mt-24">
        <h1 className="w-4/5 font-bold leading-tight">
          {[
            "UNLEASH",
            "YOUR",
            "CREATIVITY",
            "EMBRACE",
            "THE",
            "FUTURE",
            "AND",
            "MINT",
            "YOUR",
            "DIGITAL",
            "LEGACY.",
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
