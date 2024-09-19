import { saveTokenToDatabase } from "@/app/actions/addToken";
import prisma from "@/db/db";

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(req: NextRequest) {
  const userId = req.headers.get("userId");
  try {
    const userTokens = await prisma.user.findUnique({
      where: { id: parseInt(userId as string, 10) }, // Ensure userId is converted to a number if required
      include: { tokens: true },
    });

    return NextResponse.json({
      token: userTokens,
      statusCode: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      message: "Error in getting user token",
      statusCode: 500,
    });
  }
}
export type Payload = {
  userId: string;
  walletAddress: string;
};
export async function POST(req: NextRequest) {
  console.log("API route handler executing");
  console.log("All headers:", Object.fromEntries(req.headers.entries()));

  try {
    console.log("Middleware executing for path:", req.nextUrl.pathname);

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("No token found in req headers");
      return NextResponse.json(
        { message: "You are not logged in" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET!);
    const userId = (<Payload>decoded).userId;
    const body = await req.json();
    const { data } = body;

    console.log("Received userId from headers:", userId);

    if (!data || !data.name) {
      throw new Error("Invalid data: missing required fields");
    }

    const parsedUserId = parseInt(userId);

    if (isNaN(parsedUserId)) {
      throw new Error("Invalid user ID");
    }

    console.log("Received data:", data);
    console.log("Parsed User ID:", parsedUserId);

    await saveTokenToDatabase(data, parsedUserId);

    return NextResponse.json({
      statusCode: 200,
      message: "Added token to DB",
    });
  } catch (err) {
    console.error("Error in adding token to DB:", err);
    return NextResponse.json({
      message: err.message || "Error in adding token to DB",
      statusCode: 500,
    });
  }
}
