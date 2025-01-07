/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birth_date" TEXT,
    "gender" "Gender" NOT NULL,
    "address" TEXT,
    "occupation" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_number" TEXT,
    "primary_physician" TEXT,
    "insurance_provider" TEXT,
    "insurance_policy_number" TEXT,
    "allergies" TEXT,
    "current_medication" TEXT,
    "family_medical_history" TEXT,
    "past_medical_history" TEXT,
    "identification_type" TEXT,
    "identification_number" TEXT,
    "identification_document" TEXT,
    "privacy_consent" BOOLEAN,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
