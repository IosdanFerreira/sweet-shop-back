/*
  Warnings:

  - You are about to drop the column `role_name` on the `roles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_unaccented]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_unaccented` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_unaccented` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_unaccented` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_unaccented` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name_unaccented` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name_unaccented` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "categories_name_key";

-- DropIndex
DROP INDEX "roles_role_name_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "name_unaccented" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "description_unaccented" TEXT,
ADD COLUMN     "name_unaccented" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "role_name",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "name_unaccented" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "name_unaccented" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "first_name_unaccented" TEXT NOT NULL,
ADD COLUMN     "last_name_unaccented" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_unaccented_key" ON "roles"("name_unaccented");
