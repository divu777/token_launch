import prisma from "@/db/db";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const userId = req.headers["userId"];
  try {
    const userTokens = await prisma.user.findUnique({
      where: { id: userId as unknown as number },
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
