import React from "react";
import CardImg from "../../../public/main image.jpg";

interface TokenCardProps {
  className?: string;
  key?: number;
}

const TokenCard: React.FC<TokenCardProps> = ({ className = "" }) => {
  return (
    <div
      className={`flex flex-col justify-between items-center border border-black rounded-2xl p-4 shadow-lg transition-transform transform hover:scale-105 bg-white w-80 max-w-full ${className}`}
    >
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-black">Abstract Man</h1>
        <h3 className="text-gray-700">@anonmyous</h3>
      </div>
      <div className="overflow-hidden rounded-lg mb-4">
        <img
          src={CardImg.src}
          alt="Abstract Man"
          className="w-full h-auto transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="flex justify-between items-center w-full mt-4">
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">20H : 35M : 38S</h3>
          <p className="text-sm text-gray-300">Created At</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition duration-200 text-xl font-bold">
          10000 SUP
        </button>
      </div>
    </div>
  );
};

export default TokenCard;
