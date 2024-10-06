import prisma from "@/db/db";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(url.searchParams.get("limit")) || 16; // Default limit to 16
    const skip = (page - 1) * limit;

    const tokens = await prisma.token.findMany({
      skip,
      take: limit,
    });

    const totalTokens = await prisma.token.count(); // Get total count of tokens

    return Response.json({
      tokens,
      totalPages: Math.ceil(totalTokens / limit), // Calculate total pages
      currentPage: page,
      statusCode: 200,
    });
  } catch (err) {
    console.log(err);
    return Response.json({
      message: "Error in fetching all the tokens",
      statusCode: 500,
    });
  }
}



