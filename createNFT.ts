// import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";

// const createNFT = async () => {
//   console.log("Entering createNFT function");
//   console.log("publicKey:", publicKey?.toBase58());
//   console.log("connection:", connection ? "Connected" : "Not connected");
//   console.log(
//     "signTransaction:",
//     signTransaction ? "Available" : "Not available"
//   );
//   console.log("metadataUri:", metadataUri);
//   if (!publicKey || !connection || !signTransaction || !metadataUri) {
//     console.error("Missing required data for NFT creation");
//     return;
//   }

//   try {
//     console.log("Creating Metaplex instance");
//     const metaplex = new Metaplex(connection).use(
//       walletAdapterIdentity({
//         publicKey,
//         signTransaction,

//         signMessage: async (message: Uint8Array) => {
//           // Implement message signing if needed
//           throw new Error("Message signing not implemented");
//         },
//       })
//     );

//     console.log("Initiating NFT creation");
//     // Create the NFT
//     const { nft } = await metaplex.nfts().create({
//       uri: metadataUri,
//       name: "My NFT",
//       sellerFeeBasisPoints: 0, // Royalty fee (0 for no royalties)
//     });

//     console.log("NFT created successfully!");
//     console.log("NFT Address:", nft.address.toBase58());
//     console.log("Metadata Address:", nft.metadataAddress.toBase58());
//     console.log("Mint Address:", nft.mint.address.toBase58());

//     // Additional logic such as updating the UI can be added here
//   } catch (error) {
//     console.error("Error creating NFT:", error);
//   }
// };
