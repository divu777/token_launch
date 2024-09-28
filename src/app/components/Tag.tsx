import React from "react";

const Tag = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div
      className={`flex justify-center items-center border-pink-500 border-2 py-4 px-7 rounded-full bg-white text-black text-6xl font-bold uppercase ${className}`}
    >
      {text}
    </div>
  );
};

export default Tag;
