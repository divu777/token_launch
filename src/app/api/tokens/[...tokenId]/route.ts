import prisma from "@/db/db";

export async function GET({ params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const tokenInfo = await prisma.token.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return Response.json({
      token: tokenInfo,
      statusCode: 200,
    });
  } catch (err) {
    console.log(err);
    return Response.json({
      message: "error in getting the details of the token ",
      statusCode: 500,
    });
  }
}
