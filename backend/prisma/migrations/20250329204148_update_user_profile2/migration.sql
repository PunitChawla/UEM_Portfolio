/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "createdAt",
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "education10" TEXT,
ADD COLUMN     "education12" TEXT,
ADD COLUMN     "educationGrad" TEXT,
ADD COLUMN     "gfgProfile" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "leetcodeId" TEXT,
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "projectFile" TEXT,
ADD COLUMN     "softSkills" TEXT;
