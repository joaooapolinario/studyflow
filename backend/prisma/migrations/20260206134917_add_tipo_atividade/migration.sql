/*
  Warnings:

  - Added the required column `tipo` to the `Atividade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Atividade" ADD COLUMN     "tipo" TEXT NOT NULL;
