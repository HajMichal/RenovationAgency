/*
  Warnings:

  - You are about to drop the column `estimatedcost` on the `Building` table. All the data in the column will be lost.
  - Added the required column `estimatedArea` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedCost` to the `Building` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Building` DROP COLUMN `estimatedcost`,
    ADD COLUMN `estimatedArea` VARCHAR(191) NOT NULL,
    ADD COLUMN `estimatedCost` VARCHAR(191) NOT NULL,
    MODIFY `description` LONGTEXT NOT NULL;
