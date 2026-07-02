-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('WEIGHT', 'MOVEMENT', 'MEAL');

-- CreateEnum
CREATE TYPE "MoveType" AS ENUM ('DANCE', 'WORKOUT', 'OTHER');

-- CreateEnum
CREATE TYPE "Units" AS ENUM ('LB', 'KG');

-- CreateEnum
CREATE TYPE "CoachTone" AS ENUM ('GENTLE', 'STEADY', 'STRICT');

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EntryType" NOT NULL,
    "weightLb" DOUBLE PRECISION,
    "moveType" "MoveType",
    "durationMin" INTEGER,
    "note" TEXT,
    "item" TEXT,
    "grams" INTEGER,
    "kcal" INTEGER,
    "macros" JSONB,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "units" "Units" NOT NULL DEFAULT 'LB',
    "goalWeightLb" DOUBLE PRECISION NOT NULL DEFAULT 142,
    "calorieTarget" INTEGER NOT NULL DEFAULT 1800,
    "weeklyMoveTarget" INTEGER NOT NULL DEFAULT 5,
    "coachTone" "CoachTone" NOT NULL DEFAULT 'STRICT',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedFood" (
    "id" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "grams" INTEGER NOT NULL,
    "kcal" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SavedFood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachCheckin" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "message" TEXT NOT NULL,
    "tone" "CoachTone" NOT NULL,
    "band" TEXT NOT NULL,

    CONSTRAINT "CoachCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entry_day_type_idx" ON "Entry"("day", "type");

-- CreateIndex
CREATE INDEX "Entry_type_createdAt_idx" ON "Entry"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CoachCheckin_day_key" ON "CoachCheckin"("day");

