"use client";
import React from "react";
import { motion } from "framer-motion";
import CardImg from "../../../public/outer image.jpg";

const ExpandingGatesImage = () => {
  return (
    <div style={{ position: "relative", height: "24rem", overflow: "hidden" }}>
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
        src={CardImg.src}
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
