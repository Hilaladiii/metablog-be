-- DropForeignKey
ALTER TABLE `writes` DROP FOREIGN KEY `writes_postId_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('READER', 'WRITER') NOT NULL DEFAULT 'READER';

-- AddForeignKey
ALTER TABLE `writes` ADD CONSTRAINT `writes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
