-- DropForeignKey
ALTER TABLE `Building` DROP FOREIGN KEY `Building_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Building` ADD CONSTRAINT `Building_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
