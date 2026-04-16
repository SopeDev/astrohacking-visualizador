-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "notes" TEXT,
    "assignments" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
