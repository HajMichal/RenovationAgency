-- DropForeignKey
ALTER TABLE `Contractor` DROP FOREIGN KEY `Contractor_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Contractor` ADD CONSTRAINT `Contractor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
