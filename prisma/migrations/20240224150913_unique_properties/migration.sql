/*
  Warnings:

  - A unique constraint covering the columns `[companyEmail]` on the table `Contractor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyPhone]` on the table `Contractor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `Contractor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyPhone` to the `Contractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Contractor` ADD COLUMN `companyPhone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Contractor_companyEmail_key` ON `Contractor`(`companyEmail`);

-- CreateIndex
CREATE UNIQUE INDEX `Contractor_companyPhone_key` ON `Contractor`(`companyPhone`);

-- CreateIndex
CREATE UNIQUE INDEX `Contractor_nip_key` ON `Contractor`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);
