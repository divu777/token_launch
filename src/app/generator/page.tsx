"use client";
import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { X } from "lucide-react";
import {
  createMintAccount,
  createATAAccount,
  mintTokens,
  createMetadata,
  uploadToIPFS,
  uploadMetadata,
} from "../utils/solanaUtils";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";

const TokenForm = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    decimals: "",
    supply: "",
    description: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => {
      let newValue = value;
      if (type === "number") {
        newValue = value === "" ? "" : Number(value);
        if (name === "decimals" && (newValue < 0 || newValue > 9))
          return prevData;
        if (name === "supply" && newValue < 0) return prevData;
      }
      if (type === "text" && name === "symbol" && value.length > 5)
        return prevData;
      return { ...prevData, [name]: newValue };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prevData) => ({ ...prevData, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prevData) => ({ ...prevData, image: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publicKey || !signTransaction) return;
    try {
      // ... rest of your submit logic remains the same
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <>
      <AppBar />
      <div className="bg-black text-white p-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-lg mr-2"></div>
            <span className="text-xl">Token Creator</span>
          </div>
          <div className="flex gap-4">
            <button className="text-white hover:text-gray-300">Sign up</button>
            <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200">
              Contact us
            </button>
          </div>
        </div>

        <div className="absolute top-4 right-4 w-48 h-48 transform rotate-3 z-10">
          <div className="bg-white p-2 rounded-lg shadow-lg relative">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Token preview"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} className="text-white" />
                </button>
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-gray-400 mb-12">
            Let's create your token! Fill out the details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="flex items-center">
              <h1 className="text-6xl font-bold whitespace-nowrap">Hello</h1>
              <span className="text-6xl ml-4">😊</span>
            </div>

            {[
              {
                label: "I would name my token",
                name: "name",
                type: "text",
                placeholder: "Enter token name",
              },
              {
                label: "Its symbol would be",
                name: "symbol",
                type: "text",
                placeholder: "Max 5 characters",
              },
              {
                label: "With decimals of",
                name: "decimals",
                type: "number",
                placeholder: "0-9",
              },
              {
                label: "And supply of",
                name: "supply",
                type: "number",
                placeholder: "Enter token supply",
              },
              {
                label: "Described as",
                name: "description",
                type: "text",
                placeholder: "Enter token description",
              },
            ].map((field) => (
              <div key={field.name} className="flex items-center gap-8">
                <h2 className="text-3xl font-bold whitespace-nowrap flex-shrink-0 w-1/3">
                  {field.label}
                </h2>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="flex-grow bg-transparent border-b border-gray-700 focus:border-white outline-none py-2 text-xl text-gray-400"
                  placeholder={field.placeholder}
                  required
                />
              </div>
            ))}

            <div className="flex items-center gap-8">
              <h2 className="text-3xl font-bold whitespace-nowrap flex-shrink-0 w-1/3">
                Looking like
              </h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-grow text-gray-400 py-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!publicKey}
              className="mt-12 w-full bg-white text-black py-4 rounded-full text-3xl font-bold hover:bg-gray-200 relative group flex items-center justify-between px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Submit</span>
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
                <div className="w-8 h-1 bg-white transform rotate-45 absolute"></div>
                <div className="w-8 h-1 bg-white transform -rotate-45 absolute"></div>
              </div>
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TokenForm;
