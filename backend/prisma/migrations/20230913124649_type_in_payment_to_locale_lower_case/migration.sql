/*
  Warnings:

  - You are about to drop the column `Type` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `Type`,
    ADD COLUMN `type` ENUM('CASH', 'GOODS') NOT NULL DEFAULT 'CASH';
