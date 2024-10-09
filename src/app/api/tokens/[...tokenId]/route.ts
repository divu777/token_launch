import prisma from "@/db/db";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const tokenId = parseInt(params.tokenId);
    
    if (isNaN(tokenId)) {
      return Response.json({
        message: "Invalid token ID",
        statusCode: 400,
      });
    }

    const token = await prisma.token.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            wallet: true,
            profilePic:true
          },
        },
      },
    });

    if (!token) {
      return Response.json({
        message: "Token not found",
        statusCode: 404,
      });
    }

    return Response.json({
      token,
      statusCode: 200,
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      message: "Error in getting the details of the token",
      statusCode: 500,
    });
  }
}