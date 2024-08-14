/*
  Warnings:

  - You are about to drop the column `role` on the `Org` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Org" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";
