"use client"
import { motion } from 'framer-motion';
import React from 'react'
import CardImg2 from "../../../public/img2.png";

const About = () => {
  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="relative flex justify-end items-center   h-2/3">

        <motion.img
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 1 }}
          src={CardImg2.src}
          alt=""
          className="h-96 absolute top-20 left-40 "
        />
        <div className="flex gap-10 text-2xl font-medium  w-1/2 h-full py-20 justify-center items-start ">
          <h1>SIMPLE AND TIMELESS</h1>
          <p className=" max-w-96">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae quis
            accusamus dignissimos voluptatem commodi odit molestiae dolore
            ratione dolor molestias laborum quam beatae mollitia perferendis,
            odio itaque aperiam explicabo? A.
          </p>
        </div>
      </div>
      <div className="flex justify-center w-full items-start  text-5xl h-1/3 py-5 ">
        <h1 className="w-4/5 font-semibold">
          DISCOVER EVERYDAY ESSENTIALS DESIGNED FOR A BLEN OF COMFORT AND
          ELEGANCE.{" "}
        </h1>
      </div>
    </div>
  );
}

export default About