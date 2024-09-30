"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CardImg2 from "../../../public/img2.png";
import CardImg from "../../../public/outer image.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Bento = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-3xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Discover Other Collections
      </motion.h1>
      <motion.div
        className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col gap-4"
          variants={containerVariants}
        >
          <motion.div
            className="w-full h-64 relative overflow-hidden rounded-lg"
            variants={itemVariants}
          >
            <Image
              src={CardImg}
              alt="Main collection image"
              layout="fill"
              objectFit="cover"
            />
          </motion.div>
          <div className="flex gap-4 justify-between">
            {[CardImg2, CardImg2, CardImg2].map((img, index) => (
              <motion.div
                key={index}
                className="w-1/3 h-40 relative overflow-hidden rounded-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={img}
                  alt={`Collection item ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Bento;
