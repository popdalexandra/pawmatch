-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADOPTER', 'SHELTER_STAFF');

-- CreateEnum
CREATE TYPE "HousingType" AS ENUM ('APARTMENT', 'HOUSE');

-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "PetStatus" AS ENUM ('AVAILABLE', 'PENDING', 'ADOPTED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'INTERVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shelter" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shelter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShelterStaff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shelterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShelterStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdopterProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "housingType" "HousingType" NOT NULL,
    "hasYard" BOOLEAN NOT NULL,
    "hasChildren" BOOLEAN NOT NULL,
    "hasPets" BOOLEAN NOT NULL,
    "activityLevel" "EnergyLevel" NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdopterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "species" VARCHAR(100) NOT NULL,
    "age" INTEGER NOT NULL,
    "housingRequirement" "HousingType" NOT NULL,
    "childFriendly" BOOLEAN NOT NULL,
    "dogFriendly" BOOLEAN NOT NULL,
    "catFriendly" BOOLEAN NOT NULL,
    "energyLevel" "EnergyLevel" NOT NULL,
    "shelterId" TEXT NOT NULL,
    "status" "PetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "adopterId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchResult" (
    "id" TEXT NOT NULL,
    "adopterId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "score" DECIMAL(65,30) NOT NULL,
    "isEligible" BOOLEAN NOT NULL,
    "explanation" TEXT,
    "modelName" TEXT,
    "algorithmVersion" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ShelterStaff_shelterId_idx" ON "ShelterStaff"("shelterId");

-- CreateIndex
CREATE UNIQUE INDEX "ShelterStaff_userId_key" ON "ShelterStaff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdopterProfile_userId_key" ON "AdopterProfile"("userId");

-- CreateIndex
CREATE INDEX "Pet_shelterId_idx" ON "Pet"("shelterId");

-- CreateIndex
CREATE INDEX "Pet_status_housingRequirement_energyLevel_idx" ON "Pet"("status", "housingRequirement", "energyLevel");

-- CreateIndex
CREATE INDEX "Application_petId_idx" ON "Application"("petId");

-- CreateIndex
CREATE INDEX "Application_adopterId_idx" ON "Application"("adopterId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "MatchResult_petId_idx" ON "MatchResult"("petId");

-- CreateIndex
CREATE INDEX "MatchResult_adopterId_idx" ON "MatchResult"("adopterId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchResult_adopterId_petId_key" ON "MatchResult"("adopterId", "petId");

-- AddForeignKey
ALTER TABLE "ShelterStaff" ADD CONSTRAINT "ShelterStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShelterStaff" ADD CONSTRAINT "ShelterStaff_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopterProfile" ADD CONSTRAINT "AdopterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enforce single active application per user per pet
CREATE UNIQUE INDEX "unique_active_application_per_adopter_pet" 
ON "Application" ("adopterId", "petId") 
WHERE "status" IN ('SUBMITTED', 'UNDER_REVIEW', 'INTERVIEW', 'APPROVED');