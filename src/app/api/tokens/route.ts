import prisma from "@/db/db";

export async function GET() {
  try {
    const tokens = await prisma.token.findMany({});
    return Response.json({
      tokens,
      statusCode: 200,
    });
  } catch (err) {
    console.log(err);
    return Response.json({
      message: "error in fetching all the tokens",
      statusCode: 500,
    });
  }
}

console.log("gottt");

export async function POST() {
  try {
  } catch (err) {
    console.log(err);
    return Response.json({
      message: "error in fetching all the tokens",
      statusCode: 500,
    });
  }
}
