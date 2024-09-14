// import {
//   clusterApiUrl,
//   Connection,
//   LAMPORTS_PER_SOL,
//   PublicKey,
// } from "@solana/web3.js";
// import base58 from "bs58";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const connection = new Connection("https://api.devnet.solana.com");
//   try {
//     const body = await req.json();
//     const { publicKey, tokenamount } = body;

//     const TOKEN_REQUIRED = tokenamount * LAMPORTS_PER_SOL;

//     const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

//     const pubKeyObj = new PublicKey(publicKey);

//     // const airdropignature = await connection.requestAirdrop(
//     //   pubKeyObj,
//     //   TOKEN_REQUIRED
//     // );

//     const walletBalance = await connection.getBalance(pubKeyObj);
//     console.log(`Wallet balance is ${walletBalance}`);

//     return NextResponse.json({
//       walletBalance: walletBalance / LAMPORTS_PER_SOL,
//     });

//     // await connection.confirmTransaction(airdropignature);
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({
//       error: err,
//       message: "Error in adding funds",
//       statusCode: 500,
//     });
//   }
// }
