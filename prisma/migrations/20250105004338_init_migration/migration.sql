-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");
