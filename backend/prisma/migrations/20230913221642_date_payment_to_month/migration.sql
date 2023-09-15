/*
  Warnings:

  - You are about to drop the column `date` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `date`,
    ADD COLUMN `month` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
