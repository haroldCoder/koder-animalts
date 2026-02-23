/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Veterinarian` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Veterinarian` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Veterinarian" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
