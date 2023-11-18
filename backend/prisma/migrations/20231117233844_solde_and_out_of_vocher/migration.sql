-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `outOfVocher` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Session` MODIFY `data` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `Solde` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `description` VARCHAR(191) NULL,
    `workerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Solde` ADD CONSTRAINT `Solde_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `Worker`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
