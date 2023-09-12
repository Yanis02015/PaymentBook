/*
  Warnings:

  - You are about to drop the column `acquitted` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `rest` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `acquitted`,
    DROP COLUMN `payment`,
    DROP COLUMN `rest`,
    ADD COLUMN `amount` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('CASH', 'GOODS') NOT NULL DEFAULT 'CASH';

-- AlterTable
ALTER TABLE `Worker` MODIFY `image` VARCHAR(191) NOT NULL DEFAULT 'default.png';

-- CreateTable
CREATE TABLE `Vocher` (
    `id` VARCHAR(191) NOT NULL,
    `remuneration` DECIMAL(65, 30) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `workerId` VARCHAR(191) NOT NULL,
    `typeId` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VocherType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `remuneration` DECIMAL(65, 30) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vocher` ADD CONSTRAINT `Vocher_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `Worker`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vocher` ADD CONSTRAINT `Vocher_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `VocherType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
