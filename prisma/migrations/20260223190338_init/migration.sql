/*
  Warnings:

  - You are about to drop the column `email` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Veterinarian` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Veterinarian` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Owner_email_key";

-- DropIndex
DROP INDEX "Veterinarian_email_key";

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName";

-- AlterTable
ALTER TABLE "Veterinarian" DROP COLUMN "email",
DROP COLUMN "name";
