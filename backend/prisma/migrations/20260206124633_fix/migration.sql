/*
  Warnings:

  - You are about to drop the column `valorMaximo` on the `Nota` table. All the data in the column will be lost.
  - Added the required column `notaMaxima` to the `Nota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nota" DROP COLUMN "valorMaximo",
ADD COLUMN     "notaMaxima" DOUBLE PRECISION NOT NULL;
