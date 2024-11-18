/*
  Warnings:

  - You are about to drop the column `outOfVocher` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `Solde` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Solde` DROP FOREIGN KEY `Solde_workerId_fkey`;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `outOfVocher`;

-- DropTable
DROP TABLE `Solde`;
