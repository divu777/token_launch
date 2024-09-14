"use client";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AppBar from "./AppBar";

const TokenForm = () => {
  const { connection } = useConnection();
  const [mintAddress, setMintAddress] = useState<PublicKey | null>(null);
  const [ataAddress, setAtaAddress] = useState<PublicKey | null>(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: { target: { files: any[] } }) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    console.log(formData);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleSpltoken();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
  };

  const createmintaccont = async () => {
    if (!publicKey || !signTransaction) {
      console.error("Wallet not connected!");
      return;
    }

    try {
      //getting the rent required to pay to avoid being deleted
      const lamports = await connection.getMinimumBalanceForRentExemption(82);
      //generate new keypair
      const mintKeypair = Keypair.generate();
      //instruction for creating account
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: publicKey, // Your wallet address
        newAccountPubkey: mintKeypair.publicKey, // The mint account's address
        space: 82, // The space required for the mint account (82 bytes)
        lamports, // The rent-exempt amount of SOL
        programId: TOKEN_PROGRAM_ID, // The Token Program ID (this tells Solana you're creating a token)
      });

      //instruction for adding authority to the mint
      const initializeMintInstruction = createInitializeMintInstruction(
        mintKeypair.publicKey, // The mint account's address
        formData.decimals as unknown as number, // Number of decimals for the token
        publicKey, // The mint authority (your wallet address)
        publicKey // Freeze authority (optional, can freeze token transfers)
      );

      //instruction sent to blockchain ( in this we create and initailize )
      const transaction = new Transaction().add(
        createAccountInstruction,
        initializeMintInstruction
      );
      // transaction.feePayer = publicKey;
      // transaction.recentBlockhash = (
      //   await connection.getLatestBlockhash()
      // ).blockhash;

      // Use getLatestBlockhash instead of getRecentBlockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;

      transaction.feePayer = publicKey; // The wallet paying for the transaction fees

      //signing : u authorized this transaction
      const signedTransaction = await signTransaction(transaction);
      signedTransaction.partialSign(mintKeypair);

      //sent to solana network
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      await connection.confirmTransaction(signature);

      //set value of the mint public address
      setMintAddress(mintKeypair.publicKey);
      console.log("Token mint created:", mintKeypair.publicKey.toBase58());
      return mintKeypair.publicKey;
      // let mintAccount = await getMint(connection, mintAddress!);
    } catch (error) {
      console.error("Failed to create token mint:", error);
    }
  };
  const uploadToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw error;
    }
  };

  const uploadMetadata = async (
    name: string,
    symbol: string,
    description: string,
    imageUrl: string
  ) => {
    const metadata = JSON.stringify({
      name: name,
      symbol: symbol,
      description: description,
      image: imageUrl,
    });

    const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
    if (!pinataApiKey || !pinataSecretApiKey) {
      throw new Error("Missing Pinata API keys in environment variables");
    }
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      throw error;
    }
  };
  const createMetadata = async (metadataUri: string, mintAddress) => {
    if (!publicKey || !signTransaction) {
      console.error("Required accounts or metadata URI not available!");
      return;
    }

    try {
      const metaplex = new Metaplex(connection).use(
        walletAdapterIdentity({
          publicKey,
          signTransaction,
          signMessage: async (message: Uint8Array) => {
            throw new Error("Message signing not implemented");
          },
        })
      );

      const metadataPda = metaplex
        .nfts()
        .pdas()
        .metadata({ mint: mintAddress });

      const createMetadataInstruction =
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataPda,
            mint: mintAddress,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: "My Token",
                symbol: "MYTKN",
                uri: metadataUri,
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null,
              },
              isMutable: true,
              collectionDetails: null,
            },
          }
        );

      const transaction = new Transaction().add(createMetadataInstruction);

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      await connection.confirmTransaction(signature);

      console.log("Metadata created successfully!");
      console.log("Metadata PDA:", metadataPda.toBase58());
    } catch (error) {
      console.error("Error creating metadata:", error);
    }
  };

  const createATAaccount = async (mintAddress) => {
    if (!publicKey || !signTransaction) {
      console.error("Wallet or mint address not available!");
      return;
    }

    try {
      // Derive the ATA address manually
      const ataAddress = await getAssociatedTokenAddressSync(
        mintAddress,
        publicKey
      );

      // Check if ATA already exists
      const accountInfo = await connection.getAccountInfo(ataAddress);
      if (accountInfo) {
        console.log("ATA already exists at address:", ataAddress.toBase58());
        setAtaAddress(ataAddress); // Store the existing ATA address
        return;
      }

      // Create ATA instruction
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        publicKey, // Payer
        ataAddress, // ATA address
        publicKey, // Owner of the ATA
        mintAddress, // Mint address
        TOKEN_PROGRAM_ID, // Token Program ID
        ASSOCIATED_TOKEN_PROGRAM_ID // Associated Token Program ID
      );

      // Create transaction
      const transaction = new Transaction().add(createATAInstruction);

      // Get latest blockhash and set transaction details
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = publicKey;

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      // Send the transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Wait for confirmation
      await connection.confirmTransaction(signature);

      // Store the newly created ATA address in state
      setAtaAddress(ataAddress);
      console.log(
        "ATA created successfully at address:",
        ataAddress.toBase58()
      );
      return ataAddress;
    } catch (error) {
      console.error("Failed to create ATA:", error);
    }
  };

  const mintTokens = async (ataAddress, mintAddress) => {
    if (!publicKey || !signTransaction) {
      console.error("Required accounts not available!");
      return;
    }

    try {
      // Define the amount to mint (e.g., 1000 tokens with 9 decimal places)
      const amount = 1000 * Math.pow(10, 9);

      // Create the minting instruction
      const mintInstruction = createMintToInstruction(
        mintAddress, // mint account
        ataAddress, // destination account (ATA)
        publicKey, // mint authority
        amount, // amount to mint
        [], // no multisig signers
        TOKEN_PROGRAM_ID // token program ID
      );
      console.log("instruction created");

      // Create a new transaction and add the minting instruction
      const transaction = new Transaction().add(mintInstruction);
      console.log("add the new trans");
      // Get the latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = publicKey;

      console.log("got recent hash");

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);
      console.log("sign transss");
      // Send the transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      console.log("trnas sendtt");

      // Wait for confirmation
      await connection.confirmTransaction(signature);

      console.log(`Minted ${amount} tokens to ${ataAddress.toBase58()}`);
      console.log(`Transaction signature: ${signature}`);
    } catch (error) {
      console.error("Failed to mint tokens:", error);
    }
  };
  const [imageFile, setImageFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };
  const handleSpltoken = async () => {
    const mintAd = await createmintaccont();
    console.log(mintAd?.toBase58());
    await new Promise((r) => setTimeout(r, 10000));

    const ataAd = await createATAaccount(mintAd);
    console.log(ataAd?.toBase58());
    await new Promise((r) => setTimeout(r, 15000));
    await mintTokens(ataAd, mintAd);
    if (!imageFile) {
      console.error("Image file or mint address not available!");
      return;
    }

    try {
      // Upload image to IPFS
      const imageUrl = await uploadToIPFS(imageFile);
      console.log("Image uploaded to IPFS:", imageUrl);

      // Create and upload metadata
      const metadataUrl = await uploadMetadata(
        formData.name,
        formData.symbol,
        formData.description,
        imageUrl
      );

      //   setMetadataUri(metadataUrl);
      console.log("Metadata uploaded to IPFS:", metadataUrl);
      await new Promise((r) => setTimeout(r, 2000));
      console.log("Metadata uploaded to IPFS:", metadataUrl);

      await createMetadata(metadataUrl, mintAd);
      // setMetadataUri(metadataUrl);
    } catch (error) {
      console.error("Error in NFT creation process:", error);
    }
  };

  useEffect(() => {
    if (connection && publicKey) {
      console.log(connection + " " + publicKey.toBase58());
    }
  }, [connection, publicKey]);
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className=" text-black w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="symbol" className="  block mb-1">
            Symbol
          </label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            required
            className=" text-black w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="decimals" className="  block mb-1">
            Decimals (max 9)
          </label>
          <input
            type="number"
            id="decimals"
            name="decimals"
            value={formData.decimals}
            onChange={handleInputChange}
            min="0"
            max="9"
            required
            className=" text-black w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="supply" className="  block mb-1">
            Supply (max 10000)
          </label>
          <input
            type="number"
            id="supply"
            name="supply"
            value={formData.supply}
            onChange={handleInputChange}
            min="0"
            max="10000"
            required
            className=" text-black w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="description" className="  block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className=" text-black w-full px-3 py-2 border rounded"
            rows={3}
          ></textarea>
        </div>

        <div>
          <label htmlFor="image" className="  block mb-1">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageUpload}
            accept="image/*"
            className=" text-black w-full px-3 py-2 border rounded "
          />
        </div>
        <div>
          <label htmlFor="image" className="  block mb-1">
            Upload Image 2
          </label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-xs h-auto rounded shadow-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove Image
            </button>
          </div>
        )}

        <button
          type="submit"
          className=" text-black bg-blue-500  px-4 py-2 rounded hover:bg-blue-600"
          disabled={!publicKey}
        >
          Create Token
        </button>
      </form>
    </>
  );
};

export default TokenForm;
