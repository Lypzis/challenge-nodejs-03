-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Org" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
