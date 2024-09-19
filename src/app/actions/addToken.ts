
import prisma from "@/db/db";

export interface dataType {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
  description: string;
  imageUrl: string;
}

export const saveTokenToDatabase = async (data: dataType, userId: number) => {
  try {
    if (!data || !data.name) {
      throw new Error("Invalid data object: missing name property");
    }

    if (!userId) {
      throw new Error("Invalid userId: userId is required");
    }

    console.log("Data being saved:", data);
    console.log("User ID:", userId);

    const result = await prisma.token.create({
      data: {
        name: data.name,
        symbol: data.symbol,
        decimals: parseInt(data.decimals) || 0,
        amount: parseInt(data.supply) || 0,
        description: data.description,
        imageUrl: data.imageUrl,
        creator: {
          connect: { id: userId },
        },
      },
    });

    console.log("Token saved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error saving token to database:", error);
    throw error;
  }
};
