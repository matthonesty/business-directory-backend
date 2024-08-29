/*
  Warnings:

  - You are about to drop the column `brandName` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `businessLicenseNumber` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `closingTime` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `openingTime` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Business` table. All the data in the column will be lost.
  - You are about to alter the column `latitude` on the `Business` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `DoublePrecision`.
  - You are about to alter the column `longitude` on the `Business` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `DoublePrecision`.
  - A unique constraint covering the columns `[businessEmail]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessPhone]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessEmail` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Made the column `businessAddress` on table `Business` required. This step will fail if there are existing NULL values in that column.
  - Made the column `businessPhone` on table `Business` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "brandName",
DROP COLUMN "businessLicenseNumber",
DROP COLUMN "closingTime",
DROP COLUMN "openingTime",
DROP COLUMN "verified",
ADD COLUMN     "businessEmail" TEXT NOT NULL,
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "subCategoryId" TEXT,
ADD COLUMN     "websiteUrl" TEXT,
ALTER COLUMN "businessAddress" SET NOT NULL,
ALTER COLUMN "businessPhone" SET NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" DROP NOT NULL,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "SocialMediaLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_key" ON "SubCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessEmail_key" ON "Business"("businessEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessPhone_key" ON "Business"("businessPhone");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaLink" ADD CONSTRAINT "SocialMediaLink_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
