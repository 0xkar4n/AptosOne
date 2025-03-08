-- CreateTable
CREATE TABLE "UserWallet" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "aptosOneWalletAddress" TEXT NOT NULL,
    "encryptedPrivateKey" TEXT NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserWallet_walletAddress_key" ON "UserWallet"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "UserWallet_aptosOneWalletAddress_key" ON "UserWallet"("aptosOneWalletAddress");
