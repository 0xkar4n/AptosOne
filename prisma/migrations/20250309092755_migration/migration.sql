/*
  Warnings:

  - You are about to alter the column `aptosOneWalletAddress` on the `UserWallet` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(67)`.

*/
-- AlterTable
ALTER TABLE "UserWallet" ALTER COLUMN "aptosOneWalletAddress" SET DATA TYPE VARCHAR(67);
