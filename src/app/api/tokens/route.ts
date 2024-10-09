import prisma from "@/db/db";

export async function GET(request: Request) {
  try {
    // Use the URL constructor with request.headers.get('host') to reconstruct the URL
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1"); // Default to page 1
    const limit = parseInt(url.searchParams.get("limit") || "16"); // Default limit to 16
    const skip = (page - 1) * limit;

    const tokens = await prisma.token.findMany({
      skip,
      take: limit,
    });

    const totalTokens = await prisma.token.count(); // Get total count of tokens

    return new Response(
      JSON.stringify({
        tokens,
        totalPages: Math.ceil(totalTokens / limit), // Calculate total pages
        currentPage: page,
        statusCode: 200,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        message: "Error in fetching all the tokens",
        statusCode: 500,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
