"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppBar from "../components/AppBar";
import axios from "axios";
import { dataType } from "../actions/addToken";
import {
  createMintAccount,
  createATAAccount,
  mintTokens,
  uploadToIPFS,
  uploadMetadata,
  createMetadata,
} from "../utils/solanaUtils";

const FormField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  className = "",
}) => (
  <div className="flex items-baseline gap-8">
    <h2 className="text-5xl font-bold whitespace-nowrap">{label}</h2>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={`bg-transparent border-b border-gray-700 focus:border-white outline-none py-2 text-xl text-gray-400 ${className}`}
      required
    />
  </div>
);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  const steps = [
    "Creating your mint account",
    "Creating your ATA account",
    "Minting tokens",
    "Uploading image",
    "Creating metadata",
    "Finalizing",
  ];

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

  const removeImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setFormData((prevData) => ({ ...prevData, image: null }));
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.symbol &&
      formData.decimals !== "" &&
      formData.supply &&
      formData.description &&
      formData.image
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publicKey || !signTransaction || !isFormValid()) return;

    setIsSubmitting(true);
    setCurrentStep(0);

    try {
      // Step 1: Create Mint Account
      setCurrentStep(0);
      const mintAd = await createMintAccount(
        connection,
        publicKey,
        signTransaction,
        parseInt(formData.decimals)
      );
      await new Promise((r) => setTimeout(r, 2000));

      // Step 2: Create ATA Account
      setCurrentStep(1);
      const ataAd = await createATAAccount(
        connection,
        publicKey,
        signTransaction,
        mintAd
      );
      await new Promise((r) => setTimeout(r, 2000));

      // Step 3: Mint Tokens
      setCurrentStep(2);
      await mintTokens(connection, publicKey, signTransaction, ataAd, mintAd);
      await new Promise((r) => setTimeout(r, 2000));

      // Step 4: Upload Image
      setCurrentStep(3);
      const imageUrl = await uploadToIPFS(formData.image);
      await new Promise((r) => setTimeout(r, 2000));

      // Step 5: Create Metadata
      setCurrentStep(4);
      const metadataUrl = await uploadMetadata(
        formData.name,
        formData.symbol,
        formData.description,
        imageUrl
      );
      await createMetadata(
        connection,
        publicKey,
        signTransaction,
        metadataUrl,
        mintAd,
        formData.name,
        formData.symbol
      );
      await new Promise((r) => setTimeout(r, 2000));

      // Step 6: Finalize
      setCurrentStep(5);
      const data: dataType = {
        name: formData.name,
        symbol: formData.symbol,
        decimals: formData.decimals,
        supply: formData.supply,
        description: formData.description,
        imageUrl,
      };
      const token = localStorage.getItem("token");
      await axios.post("/api/user/token", { data }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset form and state
      setFormData({
        name: "",
        symbol: "",
        decimals: "",
        supply: "",
        description: "",
        image: null,
      });
      setImagePreview(null);
      setIsSubmitting(false);
      setCurrentStep(0);
    } catch (error) {
      console.error("Error in form submission:", error);
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <AppBar />
      <div className="bg-black text-white p-8 relative overflow-hidden">
        <label className="absolute top-16 right-16 w-48 h-48 transform rotate-6 z-10 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="bg-white p-2 rounded-lg shadow-lg relative w-48 h-48 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Token preview"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 z-20"
                >
                  <X size={16} className="text-white" />
                </button>
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex flex-col items-center justify-center group">
                <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  Click to add image
                </span>
              </div>
            )}
          </div>
        </label>

        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 mb-11">
            Let's create your token and get you started! Fill out the details
            below.
          </p>

          <div className="flex items-center mb-5">
            <h1 className="text-6xl font-bold whitespace-nowrap">Hello</h1>
            <span className="text-6xl ml-4">😊</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <FormField
                label="I WOULD NAME MY TOKEN"
                type="text"
                placeholder="Enter token name"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                className="w-[480px]"
              />

              <FormField
                label="ITS SYMBOL WOULD BE"
                type="text"
                placeholder="Max 5 characters"
                value={formData.symbol}
                onChange={handleInputChange}
                name="symbol"
                className="w-[570px]"
              />

              <FormField
                label="WITH DECIMALS OF"
                type="number"
                placeholder="0-9"
                value={formData.decimals}
                onChange={handleInputChange}
                name="decimals"
                className="w-[660px]"
              />

              <FormField
                label="AND SUPPLY OF"
                type="number"
                placeholder="Enter token supply"
                value={formData.supply}
                onChange={handleInputChange}
                name="supply"
                className="w-[750px]"
              />

              <FormField
                label="DESCRIBED AS"
                type="text"
                placeholder="Enter token description"
                value={formData.description}
                onChange={handleInputChange}
                name="description"
                className="w-[900px]"
              />
            </div>

            <button
              type="submit"
              disabled={!publicKey || !isFormValid() || isSubmitting}
              className="mt-8 w-full bg-white text-black py-4 rounded-full text-3xl font-bold hover:bg-gray-200 relative group flex items-center justify-between px-8 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{isSubmitting ? "Processing..." : "Submit"}</span>
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
                <div className="w-8 h-1 bg-white transform rotate-45 absolute"></div>
                <div className="w-8 h-1 bg-white transform -rotate-45 absolute"></div>
              </div>
            </button>
          </form>
        </div>

        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            >
              <div className="bg-white p-8 rounded-lg shadow-xl text-black max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Creating Your Mint Account</h2>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0.5 }}
                      animate={{
                        opacity: index === currentStep ? 1 : 0.5,
                        scale: index === currentStep ? 1.05 : 1,
                      }}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${
                          index <= currentStep ? "bg-green-500" : "bg-gray-300"
                        } flex items-center justify-center text-white text-sm`}
                      >
                        {index < currentStep ? "✓" : index + 1}
                      </div>
                      <span>{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg"
            >
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 bg-white text-red-500 px-4 py-2 rounded"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TokenForm;