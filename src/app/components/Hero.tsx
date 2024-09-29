"use client"
import React from "react";
import CardImg2 from "../../../public/img2.png";
import ExpandableImg from "./ExpandableImg";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="flex h-screen justify-evenly items-center relative "> 
      <div className="flex flex-col justify-center items-center bg-green-500 w-full">
        <h1 className="text-[12rem] font-bold absolute top-80">
          CREATE SPL TOK
        </h1>
      </div>

      <motion.img
        initial={{ y: -250 }}
        animate={{ y: 0 }}
        transition={{ duration: 1 }}
        src={CardImg2.src}
        alt=""
        className="h-40 absolute top-0 right-40 z-0"/>

      <div className="absolute right-50 top-0">
        <ExpandableImg />
      </div>
    </div>
  );
};

export default Hero;