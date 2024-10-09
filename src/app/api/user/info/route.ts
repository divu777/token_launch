import prisma from "@/db/db";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import { Payload } from "../token/route";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("No token found in req headers");
    return NextResponse.json(
      { message: "You are not logged in" },
      { status: 401 }
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET!);
  } catch (err) {
    return NextResponse.json({
      message: "Invalid token",
      status: 401,
    });
  }

  const userId = (<Payload>decoded).userId;
  const walletAddress = (<Payload>decoded).walletAddress;
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  try {
    const userInfo = await prisma.user.findUnique({
      where: {
        id: parseInt(userId as string, 10),
      },
      include: { tokens: true } // Fetch related tokens
    });

    if (!userInfo) {
      return NextResponse.json({
        message: "User not found",
        status: 404,
      });
    }

    const pubKeyObj = new PublicKey(walletAddress!);
    const walletBalance = await connection.getBalance(pubKeyObj);
    console.log(`Wallet balance is ${walletBalance}`);

    return NextResponse.json({
      userInfo,
      walletBalance: walletBalance / LAMPORTS_PER_SOL,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    return NextResponse.json({
      message: "Error in getting user data",
      statusCode: 500,
    });
  }
}







// update name 
export async function PUT(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("No token found in req headers");
    return NextResponse.json(
      { message: "You are not logged in" },
      { status: 401 }
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET!);
  } catch (err) {
    return NextResponse.json({
      message: "Invalid token",
      status: 401,
    });
  }

  const userId = (<Payload>decoded).userId;
  const walletAddress = (<Payload>decoded).walletAddress;
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const body = await req.json();
  const { name } = body;

  try {
    const userInfo = await prisma.user.update({
      where: {
        id: parseInt(userId as string, 10),
      },
      data: {
        name: name,
      },
    });

    if (!userInfo) {
      return NextResponse.json({
        message: "User not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Name Updated successfull",
      statusCode: 200,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    return NextResponse.json({
      message: "Error in getting user data",
      statusCode: 500,
    });
  }
}