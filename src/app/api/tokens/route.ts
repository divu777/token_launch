import prisma from "@/db/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "8"); // Match ITEMS_PER_PAGE from frontend
    const skip = (page - 1) * limit;

    const [tokens, totalTokens] = await Promise.all([
      prisma.token.findMany({
        skip,
        take: limit,
      }),
      prisma.token.count(),
    ]);

    return new Response(
      JSON.stringify({
        tokens,
        totalTokens,
        totalPages: Math.ceil(totalTokens / limit),
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
