"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import "@solana/wallet-adapter-react-ui/styles.css";
import axios from "axios";
import FormData from "form-data";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import {
  createCreateMetadataAccountV2Instruction,
  createCreateMetadataAccountV3Instruction,
  Metadata,
} from "@metaplex-foundation/mpl-token-metadata";

const WalletDisconnectButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
  { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function WalletContent() {
  const [balance, setBalance] = useState<number | null>(null);
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [mintAddress, setMintAddress] = useState<PublicKey | null>(null);
  const [ataAddress, setAtaAddress] = useState<PublicKey | null>(null);

  // console.log(connection);
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
        8, // Number of decimals for the token
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

      // let mintAccount = await getMint(connection, mintAddress!);
    } catch (error) {
      console.error("Failed to create token mint:", error);
    }
  };

  const createATAaccount = async () => {
    if (!publicKey || !mintAddress || !signTransaction) {
      console.error("Wallet or mint address not available!");
      return;
    }

    try {
      // Derive the ATA address manually
      const ataAddress = getAssociatedTokenAddressSync(mintAddress, publicKey);

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
    } catch (error) {
      console.error("Failed to create ATA:", error);
    }
  };

  const mintTokens = async () => {
    if (!mintAddress || !ataAddress || !publicKey || !signTransaction) {
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

      // Create a new transaction and add the minting instruction
      const transaction = new Transaction().add(mintInstruction);

      // Get the latest blockhash
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

      console.log(`Minted ${amount} tokens to ${ataAddress.toBase58()}`);
      console.log(`Transaction signature: ${signature}`);
    } catch (error) {
      console.error("Failed to mint tokens:", error);
    }
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metadataUri, setMetadataUri] = useState<string | null>(null);

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
  const createMetadata = async (metadataUri: string) => {
    if (!mintAddress || !publicKey || !signTransaction) {
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
  // Function to handle file selection

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  // Function to handle the entire NFT creation process
  const handleSpltoken = async () => {
    if (!imageFile || !mintAddress) {
      console.error("Image file or mint address not available!");
      return;
    }

    try {
      // Upload image to IPFS
      const imageUrl = await uploadToIPFS(imageFile);
      console.log("Image uploaded to IPFS:", imageUrl);

      // Create and upload metadata
      const metadataUrl = await uploadMetadata(
        "My NFT",
        "MNFT",
        "This is my custom NFT",
        imageUrl
      );

      setMetadataUri(metadataUrl);
      console.log("Metadata uploaded to IPFS:", metadataUri);
      await new Promise((r) => setTimeout(r, 2000));
      console.log("Metadata uploaded to IPFS:", metadataUri);

      await createMetadata(metadataUrl);
      // setMetadataUri(metadataUrl);
    } catch (error) {
      console.error("Error in NFT creation process:", error);
    }
  };

  const sendTokens = async (
    tokenAccPublickey: string,
    mintPublicKey: string,
    ownerofTokenPublicKey: String
  ) => {};

  useEffect(() => {
    if (connection && publicKey) {
      const getInfo = async () => {
        try {
          const walletInfo = await connection.getAccountInfo(publicKey);
          if (walletInfo) {
            setBalance(walletInfo.lamports / LAMPORTS_PER_SOL);
          }
        } catch (error) {
          console.error("Failed to fetch account info:", error);
        }
      };
      getInfo();
    } else {
      setBalance(null);
    }
  }, [connection, publicKey]);

  return (
    <>
      <div className="min-h-screen text-white">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
          <div className="col-span-1 lg:col-start-2 lg:col-end-4 rounded-lg bg-[#2a302f] p-4">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-semibold">account info ✨</div>

              <WalletMultiButtonDynamic />
              <WalletDisconnectButtonDynamic />
            </div>

            <div className="mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
              <ul className="p-2">
                <li className="flex justify-between">
                  <div className="tracking-wider">Wallet is connected</div>
                  <div className="text-helius-orange italic font-semibold">
                    {publicKey ? "yes" : "no"}
                  </div>
                </li>

                <li className="text-sm mt-4 flex justify-between">
                  <div className="tracking-wider">Balance</div>
                  <div className="text-helius-orange italic font-semibold">
                    {balance !== null ? balance : "Connect First"}
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-4">
              <button
                onClick={createmintaccont}
                className="bg-helius-orange text-black font-bold py-2 px-4 rounded"
                disabled={!publicKey}
              >
                Create Mint Account
              </button>
              <button
                onClick={createATAaccount}
                className="bg-helius-orange text-black font-bold py-2 px-4 rounded"
                disabled={!publicKey}
              >
                Create Associated Token Account
              </button>
              <button
                onClick={mintTokens}
                className="bg-helius-orange text-black font-bold py-2 px-4 rounded"
                disabled={!publicKey}
              >
                Mint TOkenss
              </button>

              <div>
                <h2>Create Your NFT</h2>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <button
                  onClick={handleSpltoken}
                  className="bg-helius-orange text-black font-bold py-2 px-4 rounded"
                  disabled={!publicKey}
                >
                  createNFTTTTTT
                </button>
              </div>
            </div>

            {mintAddress && (
              <div className="mt-4 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
                <div className="text-sm">Token Mint Address:</div>
                <div className="text-helius-orange italic font-semibold break-all">
                  {mintAddress.toString()}
                </div>
              </div>
            )}

            {ataAddress && (
              <div className="mt-4 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
                <div className="text-sm">Associated Token Account Address:</div>
                <div className="text-helius-orange italic font-semibold break-all">
                  {ataAddress.toBase58()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
