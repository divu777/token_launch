import prisma from "@/db/db";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const userId = req.headers["userId"];
  const walletAddress = req.headers["walletAddress"];
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    const userInfo = await prisma.user.findUnique({
      where: {
        id: userId as unknown as number,
      },
    });

    const pubKeyObj = new PublicKey(walletAddress!);

    const walletBalance = await connection.getBalance(pubKeyObj);
    console.log(`Wallet balance is ${walletBalance}`);

    return NextResponse.json({
      userInfo,
      walletBalance: walletBalance / LAMPORTS_PER_SOL,
    });
  } catch (err) {
    return NextResponse.json({
      message: "Error in getting user data",
      statusCode: 500,
    });
  }
}
