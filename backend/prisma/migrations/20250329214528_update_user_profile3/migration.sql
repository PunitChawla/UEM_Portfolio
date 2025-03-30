/*
  Warnings:

  - You are about to drop the column `contactNo` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `leetcode` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `projectFile` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "contactNo",
DROP COLUMN "instagram",
DROP COLUMN "leetcode",
DROP COLUMN "linkedin",
DROP COLUMN "projectFile";
