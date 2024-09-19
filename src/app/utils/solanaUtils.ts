import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import axios from "axios";

// Create Mint Account
export const createMintAccount = async (
  connection: Connection,
  publicKey: PublicKey,
  signTransaction,
  decimals: unknown
) => {
  // Implementation here...

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
      decimals as unknown as number, // Number of decimals for the token
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

    console.log("Token mint created:", mintKeypair.publicKey.toBase58());
    return mintKeypair.publicKey;
    // let mintAccount = await getMint(connection, mintAddress!);
  } catch (error) {
    console.error("Failed to create token mint:", error);
  }
};

// Create ATA Account
export const createATAAccount = async (
  connection: Connection,
  publicKey: PublicKey,
  signTransaction,
  mintAddress: PublicKey
) => {
  // Implementation here...

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

      return ataAddress;
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

    console.log("ATA created successfully at address:", ataAddress.toBase58());
    return ataAddress;
  } catch (error) {
    console.error("Failed to create ATA:", error);
  }
};

// Mint Tokens
export const mintTokens = async (
  connection: Connection,
  publicKey: PublicKey,
  signTransaction,
  ataAddress: PublicKey,
  mintAddress: PublicKey
) => {
  // Implementation here...
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

// Create Metadata
export const createMetadata = async (
  connection: Connection,
  publicKey: PublicKey,
  signTransaction,
  metadataUri: string,
  mintAddress: PublicKey,
  name: string,
  symbol: string
) => {
  // Implementation here...
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

    const metadataPda = metaplex.nfts().pdas().metadata({ mint: mintAddress });

    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
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
            name,
            symbol,
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

// Upload to IPFS
export const uploadToIPFS = async (file: File) => {
  // Implementation here...
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

// Upload Metadata to IPFS
export const uploadMetadata = async (
  name: string,
  symbol: string,
  description: string,
  imageUrl: string
) => {
  // Implementation here...

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
