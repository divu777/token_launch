"use client"
import React from "react";
import CardImg2 from "../../../public/hero3.jpg";
import ExpandableImg from "./ExpandableImg";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="flex h-screen justify-evenly items-center relative  mt-12">
      <div className="flex flex-col justify-center items-center  w-full">
        <motion.h1
          initial={{ x: "-100%" }}
          animate={{ x: "5%" }}
          transition={{
            ease: [0.33, 1, 0.68, 1],
            duration: 2,
          }}
          className="text-[14rem] font-bold whitespace-nowrap  absolute top-1/2 [text-shadow:_-8px_5px_8px_#838383]"
        >
          CREATE SPL TOKEN
        </motion.h1>
      </div>

      <motion.img
        initial={{ y: -250 }}
        animate={{ y: 0 }}
        transition={{ duration: 1 }}
        src={
          "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmTR1BsgHYUsSd7u75GsQPkkqwQ2bQrnXJHQn57t9h3Wxu"
        }
        alt=""
        className="h-40 absolute top-5 right-40 z-0"
      />

      <div className="absolute right-50 top-5">
        <ExpandableImg />
      </div>
    </div>
  );
};

export default Hero;