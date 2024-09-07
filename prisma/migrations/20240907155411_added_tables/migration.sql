-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "tokenMintAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "supply" BIGINT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 9,
    "creatorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTokenBalance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "balance" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTokenBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "tokenMintAddress" TEXT NOT NULL,
    "fromAdd" TEXT NOT NULL,
    "toAdd" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_publicKey_key" ON "User"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "Token_tokenMintAddress_key" ON "Token"("tokenMintAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Token_imageUrl_key" ON "Token"("imageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "UserTokenBalance_userId_tokenId_key" ON "UserTokenBalance"("userId", "tokenId");

-- CreateIndex
CREATE INDEX "Transaction_tokenMintAddress_idx" ON "Transaction"("tokenMintAddress");

-- CreateIndex
CREATE INDEX "Transaction_fromAdd_idx" ON "Transaction"("fromAdd");

-- CreateIndex
CREATE INDEX "Transaction_toAdd_idx" ON "Transaction"("toAdd");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTokenBalance" ADD CONSTRAINT "UserTokenBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTokenBalance" ADD CONSTRAINT "UserTokenBalance_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tokenMintAddress_fkey" FOREIGN KEY ("tokenMintAddress") REFERENCES "Token"("tokenMintAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAdd_fkey" FOREIGN KEY ("fromAdd") REFERENCES "User"("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAdd_fkey" FOREIGN KEY ("toAdd") REFERENCES "User"("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE;
