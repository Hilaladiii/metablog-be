/*
  Warnings:

  - You are about to drop the column `userId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_PostToUser` DROP FOREIGN KEY `_PostToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PostToUser` DROP FOREIGN KEY `_PostToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_categoryId_fkey`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `postId`;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `_PostToUser`;

-- CreateTable
CREATE TABLE `writes` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `writes` ADD CONSTRAINT `writes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `writes` ADD CONSTRAINT `writes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
