/*
  Warnings:

  - Added the required column `description` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "description" TEXT NOT NULL;
