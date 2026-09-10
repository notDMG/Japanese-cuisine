/*
  Warnings:

  - Added the required column `author_id` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "author_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ingredients_author_id_idx" ON "ingredients"("author_id");

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
