/*
  Warnings:

  - You are about to drop the column `type` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `type`,
    ADD COLUMN `Type` ENUM('CASH', 'GOODS') NOT NULL DEFAULT 'CASH';
