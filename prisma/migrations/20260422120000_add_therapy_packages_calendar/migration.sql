-- CreateEnum
CREATE TYPE "TherapyPackage" AS ENUM ('single_session', 'initiation', 'deep_transformation', 'mastery_360');

-- CreateEnum
CREATE TYPE "PackageCycleStatus" AS ENUM ('active', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "profile_package_cycles" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "package_type" "TherapyPackage" NOT NULL,
    "session_quota" INTEGER NOT NULL,
    "status" "PackageCycleStatus" NOT NULL DEFAULT 'active',
    "purchased_at" TIMESTAMPTZ(6),
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_package_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_appointments" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "cycle_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6) NOT NULL,
    "duration_min" INTEGER,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profile_package_cycles_profile_status_idx" ON "profile_package_cycles"("profile_id", "status");

-- CreateIndex
CREATE INDEX "profile_package_cycles_profile_created_idx" ON "profile_package_cycles"("profile_id", "created_at");

-- CreateIndex
CREATE INDEX "profile_appointments_scheduled_status_idx" ON "profile_appointments"("scheduled_at", "status");

-- CreateIndex
CREATE INDEX "profile_appointments_profile_scheduled_idx" ON "profile_appointments"("profile_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "profile_appointments_cycle_status_idx" ON "profile_appointments"("cycle_id", "status");

-- AddForeignKey
ALTER TABLE "profile_package_cycles" ADD CONSTRAINT "profile_package_cycles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_appointments" ADD CONSTRAINT "profile_appointments_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_appointments" ADD CONSTRAINT "profile_appointments_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "profile_package_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
