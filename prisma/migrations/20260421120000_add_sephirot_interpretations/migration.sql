CREATE TABLE "sephirot_interpretations" (
  "id" UUID NOT NULL,
  "sephirot_id" TEXT NOT NULL,
  "planet_key" TEXT NOT NULL,
  "sign_id" TEXT NOT NULL,
  "paragraphs" JSONB NOT NULL,
  "evolution" JSONB NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "sephirot_interpretations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sephirot_interpretations_unique_combo"
ON "sephirot_interpretations"("sephirot_id", "planet_key", "sign_id");
