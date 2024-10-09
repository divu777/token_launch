"use client"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import axios from "axios"
import { X } from "lucide-react"
import { useState } from "react"
import { dataType } from "../actions/addToken"
import AppBar from "../components/AppBar"
import { createMintAccount, createATAAccount, mintTokens, uploadToIPFS, uploadMetadata, createMetadata } from "../utils/solanaUtils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface FormFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  className?: string;
}
const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  className = "",
}) => (
  <div className="flex items-baseline gap-8">
    <h2 className="text-4xl font-bold whitespace-nowrap text-gray-800">
      {label}
    </h2>
    <input
      type={type}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={onChange}
      name={name}
      className={`bg-transparent border-b border-gray-300 focus:border-gray-600 outline-none py-2 text-xl text-gray-600 ${className}`}
      required
    />
  </div>
);

export default function TokenForm() {
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
  const [error, setError] = useState<string | null>(null);
  const [tokenCreated, setTokenCreated] = useState(false);

  const steps = [
    "Creating your mint account",
    "Creating your ATA account",
    "Minting tokens",
    "Uploading image",
    "Creating metadata",
    "Finalizing",
  ];

  const handleInputChange = (e: {
    target: { name: any; value: any; type: any };
  }) => {
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
  // @ts-ignore
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-ignore
        setImagePreview(reader.result);
        setFormData((prevData) => ({ ...prevData, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };
  // @ts-ignore
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
  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publicKey || !signTransaction || !isFormValid()) return;

    setIsSubmitting(true);
    setCurrentStep(0);

    try {
      // Step 0: Create Mint Account
      setCurrentStep(0);
      const mintAd = await createMintAccount(
        connection,
        publicKey,
        signTransaction,
        parseInt(formData.decimals)
      );
      await new Promise((r) => setTimeout(r, 2000));

      // Step 1: Create ATA Account
      setCurrentStep(1);
      const ataAd = await createATAAccount(
        connection,
        publicKey,
        signTransaction,
        mintAd
      );
      await new Promise((r) => setTimeout(r, 2000));

      // Step 2: Mint Tokens
      setCurrentStep(2);
      await mintTokens(connection, publicKey, signTransaction, ataAd, mintAd);
      await new Promise((r) => setTimeout(r, 2000));

      // Step 3: Upload Image
      setCurrentStep(3);
      const imageUrl = await uploadToIPFS(formData.image!);
      await new Promise((r) => setTimeout(r, 2000));

      // Step 4: Create Metadata
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

      // Step 5: Finalize
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
      await axios.post(
        "/api/user/token",
        { data },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await new Promise((r) => setTimeout(r, 2000));

      setTokenCreated(true);
      setTimeout(() => {
        setTokenCreated(false);
        setIsSubmitting(false);
        setCurrentStep(0);
        setFormData({
          name: "",
          symbol: "",
          decimals: "",
          supply: "",
          description: "",
          image: null,
        });
        setImagePreview(null);
      }, 3000);
    } catch (error) {
      console.error("Error in form submission:", error);
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" max-h-screen">
      <AppBar />
      <div className="bg-white text-gray-800 p-8 relative overflow-hidden mt-20">
        <label className="absolute top-16 right-16 w-48 h-48 transform rotate-6 z-10 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            // @ts-ignore
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="bg-gray-200 p-2 rounded-lg shadow-lg relative w-48 h-48 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
            {imagePreview ? (
              <>
                <Image
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
              <div className="w-full h-full bg-gray-300 rounded flex flex-col items-center justify-center group">
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                  Click to add image
                </span>
              </div>
            )}
          </div>
        </label>

        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600 mb-11">
            Let&apos;s create your token and get you started! Fill out the details
            below.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <FormField
                label="I WOULD NAME MY TOKEN"
                type="text"
                placeholder="Enter token name"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                className="w-[600px]"
              />
              <FormField
                label="ITS SYMBOL WOULD BE"
                type="text"
                placeholder="Max 5 characters"
                value={formData.symbol}
                onChange={handleInputChange}
                name="symbol"
                className="w-[650px]"
              />
              <FormField
                label="WITH DECIMALS OF"
                type="number"
                placeholder="0-9"
                value={formData.decimals}
                onChange={handleInputChange}
                name="decimals"
                className="w-[750px]"
              />
              <FormField
                label="AND SUPPLY OF"
                type="number"
                placeholder="Enter token supply"
                value={formData.supply}
                onChange={handleInputChange}
                name="supply"
                className="w-[820px]"
              />
              <FormField
                label="DESCRIBED AS"
                type="text"
                placeholder="Enter token description"
                value={formData.description}
                onChange={handleInputChange}
                name="description"
                className="w-[850px]"
              />
            </div>

            <button
              type="submit"
              disabled={!publicKey || !isFormValid() || isSubmitting}
              className="mt-8 w-full bg-black text-white py-4 rounded-full text-3xl font-bold  relative group flex items-center justify-between px-8 disabled:cursor-not-allowed "
            >
              <span>{isSubmitting ? "Processing..." : "Submit"}</span>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
                <div className="w-8 h-1 bg-gray-800 transform rotate-45 absolute"></div>
                <div className="w-8 h-1 bg-gray-800 transform -rotate-45 absolute"></div>
              </div>
            </button>
            <div className="mt-4 text-center text-gray-600">
              <p>
                Need Solana tokens for devnet? Get them from the
                <a
                  href="https://faucet.solana.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline ml-1"
                >
                  Solana Faucet
                </a>
              </p>
            </div>
          </form>
        </div>

        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            >
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-gray-800 text-3xl font-bold"
              >
                {steps[currentStep]}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {tokenCreated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-green-500 text-white p-8 rounded-lg shadow-xl text-3xl font-bold">
                Token Created Successfully! 🎉
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
}
