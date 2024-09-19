/*
  Warnings:

  - You are about to drop the column `description` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `supply` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `tokenMintAddress` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTokenBalance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[wallet]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromAdd_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toAdd_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_tokenMintAddress_fkey";

-- DropForeignKey
ALTER TABLE "UserTokenBalance" DROP CONSTRAINT "UserTokenBalance_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "UserTokenBalance" DROP CONSTRAINT "UserTokenBalance_userId_fkey";

-- DropIndex
DROP INDEX "Token_imageUrl_key";

-- DropIndex
DROP INDEX "Token_tokenMintAddress_key";

-- DropIndex
DROP INDEX "User_publicKey_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "supply",
DROP COLUMN "tokenMintAddress",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "decimals" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "publicKey",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wallet" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "UserTokenBalance";

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");
