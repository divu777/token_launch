"use client";
import React from "react";
import { motion } from "framer-motion";
import CardImg from "../../../public/hero.jpg";

const ExpandingGatesImage = () => {
  return (
    <div style={{ position: "relative", height: "26rem", overflow: "hidden" }}>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }} // Scale down to reveal
        transition={{ duration: 1 }}
        style={{
          position: "absolute",
          width: "60%",
          height: "100%",
          backgroundColor: "white", // Gate color
          left: 0,
          originX: 0, // Anchor to the left
          zIndex: 1,
        }}
      />
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }} // Scale down to reveal
        transition={{ duration: 1 }}
        style={{
          position: "absolute",
          width: "60%",
          height: "100%",
          backgroundColor: "white", // Gate color
          right: 0,
          originX: 1, // Anchor to the right
          zIndex: 1,
        }}
      />
      <motion.img
        src={
          "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmZr7geoHbzdCvWQGLKHm3XTomj9FLG2MVswofFnDb3JHg"
        }
        style={{
          height: "100%",
          width: "auto",
          position: "relative",
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default ExpandingGatesImage;
