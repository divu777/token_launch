import prisma from "@/db/db";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { error } from "console";

// sign with wallet
// signing the message
export async function POST(req: NextRequest) {
  try {
    const userExist = await prisma.user.findUnique({
      where: {
        publicKey: "9BKUwj82Nbxwspu3YU6BNza1JxonC3vLxqcif9YJrhtk",
      },
    });

    if (userExist) {
      const token = jwt.sign(
        {
          userId: userExist.id,
          walletAddress: userExist.publicKey,
        },
        process.env.NEXT_SECRET!
      );
      return Response.json({
        token: token,
      });
    }

    const user = await prisma.user.create({
      data: {
        name: "divakar",
        publicKey: "9BKUwj82Nbxwspu3YU6BNza1JxonC3vLxqcif9YJrhtk",
      },
    });
    const token = jwt.sign(
      {
        userId: user.id,
        walletAddress: "9BKUwj82Nbxwspu3YU6BNza1JxonC3vLxqcif9YJrhtk",
      },
      process.env.NEXT_SECRET!
    );

    return Response.json({
      token: token,
    });
  } catch (e) {
    console.log(error);
    return Response.json({
      message: "error in Signing up user",
      statuscode: 500,
    });
  }
}
