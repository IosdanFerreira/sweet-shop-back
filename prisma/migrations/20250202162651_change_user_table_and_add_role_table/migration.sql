/*
  Warnings:

  - You are about to drop the column `allergies` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `current_medication` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emergency_contact_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emergency_contact_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `family_medical_history` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `identification_document` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `identification_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `identification_type` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `insurance_policy_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `insurance_provider` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `past_medical_history` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `primary_physician` on the `users` table. All the data in the column will be lost.
  - Made the column `privacy_consent` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "allergies",
DROP COLUMN "birth_date",
DROP COLUMN "current_medication",
DROP COLUMN "emergency_contact_name",
DROP COLUMN "emergency_contact_number",
DROP COLUMN "family_medical_history",
DROP COLUMN "gender",
DROP COLUMN "identification_document",
DROP COLUMN "identification_number",
DROP COLUMN "identification_type",
DROP COLUMN "insurance_policy_number",
DROP COLUMN "insurance_provider",
DROP COLUMN "occupation",
DROP COLUMN "past_medical_history",
DROP COLUMN "primary_physician",
ALTER COLUMN "privacy_consent" SET NOT NULL;

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");
