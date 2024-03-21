/*
  Warnings:

  - You are about to drop the column `companyAdress` on the `Contractor` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - Added the required column `companyAddress` to the `Contractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Contractor` DROP COLUMN `companyAdress`,
    ADD COLUMN `companyAddress` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `address`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL;
