"use client";
import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  createMintAccount,
  createATAAccount,
  mintTokens,
  createMetadata,
  uploadToIPFS,
  uploadMetadata,
} from "../utils/solanaUtils";

import { dataType, saveTokenToDatabase } from "../actions/addToken";
import { PublicKey } from "@solana/web3.js";
import AppBar from "../components/AppBar";
import ImagePreview from "../components/ImagePreview";
import axios from "axios";

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

      // Handle number inputs
      if (type === "number") {
        newValue = value === "" ? "" : Number(value);

        // Additional validation for decimals and supply
        if (name === "decimals" && (newValue < 0 || newValue > 9)) {
          return prevData; // Ignore invalid decimals
        }
        if (name === "supply" && newValue < 0) {
          return prevData; // Ignore negative supply
        }
      }

      // Handle text inputs
      if (type === "text") {
        if (name === "symbol" && value.length > 5) {
          return prevData; // Ignore if symbol is longer than 5 characters
        }
      }

      return {
        ...prevData,
        [name]: newValue,
      };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prevData) => ({
      ...prevData,
      image: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publicKey || !signTransaction) return;

    try {
      const mintAd = await createMintAccount(
        connection,
        publicKey,
        signTransaction,
        parseInt(formData.decimals)
      );
      console.log("Mint Address:", mintAd!.toBase58());
      await new Promise((r) => setTimeout(r, 5000));

      const ataAd = await createATAAccount(
        connection,
        publicKey,
        signTransaction,
        mintAd!
      );
      console.log("ATA Address:", ataAd!.toBase58());
      await new Promise((r) => setTimeout(r, 5000));

      await mintTokens(connection, publicKey, signTransaction, ataAd!, mintAd!);

      if (!formData.image) throw new Error("Image file required!");

      const imageUrl = await uploadToIPFS(formData.image);
      console.log("Image uploaded:", imageUrl);

      const metadataUrl = await uploadMetadata(
        formData.name,
        formData.symbol,
        formData.description,
        imageUrl
      );
      console.log("Metadata uploaded:", metadataUrl);

      await createMetadata(
        connection,
        publicKey,
        signTransaction,
        metadataUrl,
        mintAd!,
        formData.name,
        formData.symbol
      );

      const data: dataType = {
        name: formData.name,
        symbol: formData.symbol,
        decimals: formData.decimals,
        supply: formData.supply,
        description: formData.description,
        imageUrl,
      };
      const token = localStorage.getItem("token");

      console.log("Sending request with token:", token);

      const response = await axios.post(
        "/api/user/token",
        { data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <>
      <AppBar />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Token Name"
          required
        />
        <input
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleInputChange}
          placeholder="Token Symbol"
          required
        />
        <input
          type="number"
          name="decimals"
          value={formData.decimals}
          onChange={handleInputChange}
          placeholder="Decimals"
          required
        />
        <input
          type="number"
          name="supply"
          value={formData.supply}
          onChange={handleInputChange}
          placeholder="Supply"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />
        <ImagePreview
          imagePreview={imagePreview}
          onRemoveImage={handleRemoveImage}
        />
        <button
          type="submit"
          className="text-black bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          disabled={!publicKey}
        >
          Create Token
        </button>
      </form>
    </>
  );
};

export default TokenForm;
