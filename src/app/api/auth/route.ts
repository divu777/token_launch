import prisma from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { signature, publicKey } = body;
    const message = new TextEncoder().encode("Sign into mechanical turk");

    const result = nacl.sign.detached.verify(
      message,
      new Uint8Array(signature),
      new PublicKey(publicKey).toBytes()
    );

    if (!result) {
      return NextResponse.json(
        { message: "Signature verification failed" },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { wallet: publicKey },
      update: {},
      create: {
        name: "daddy",
        wallet: publicKey,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        walletAddress: publicKey,
      },
      process.env.NEXT_PUBLIC_SECRET!
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { message: "Error in authenticating user" },
      { status: 500 }
    );
  }
}
