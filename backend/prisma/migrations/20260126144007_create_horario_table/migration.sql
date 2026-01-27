-- CreateTable
CREATE TABLE "HorarioAula" (
    "id" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "inicio" TEXT NOT NULL,
    "fim" TEXT NOT NULL,
    "sala" TEXT,
    "materiaId" TEXT NOT NULL,

    CONSTRAINT "HorarioAula_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HorarioAula" ADD CONSTRAINT "HorarioAula_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "materias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
