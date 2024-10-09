-- DropIndex
DROP INDEX "Token_imageUrl_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePic" TEXT NOT NULL DEFAULT 'https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmdkkjGCuy8V9CWgdwzX7yyq3QEC5n8iNPMckjbx6U5d43';
