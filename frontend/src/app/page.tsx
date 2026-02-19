import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreateMateriaDialog } from "@/components/create-materia-dialog";
import { ScheduleDialog } from "@/components/schedule-diaog";
import { UserNav } from "@/components/user-nav";
import { MateriaCard } from "@/components/materia-card";
import { Materia, Periodo } from "@/types";
import { Calendar, AlertCircle } from "lucide-react";

async function getMaterias(token: string) {
  try {
    const res = await fetch("http://localhost:3333/periodos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Falha ao buscar");

    const periodos = await res.json();
    return periodos.length > 0 ? periodos[0].materias : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getPeriodoAtual(token: string) {
  try {
    const res = await fetch("http://localhost:3333/periodos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const periodos = await res.json();
    return periodos[0] || null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const materias: Materia[] = await getMaterias(token);
  const periodoAtual: Periodo | null = await getPeriodoAtual(token);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <header className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            StudyFlow
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {periodoAtual
              ? `${periodoAtual.codigo} • ${periodoAtual.semestre}º Semestre`
              : "Sem período ativo"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ScheduleDialog materias={materias} />
          <UserNav />
        </div>
      </header>

      {materias.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg border-dashed text-muted-foreground">
          <AlertCircle className="h-10 w-10 mb-2" />
          <p>Nenhuma matéria encontrada.</p>
          <p className="text-sm">
            Cadastre um período e matérias para começar.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materias.map((materia) => (
            <MateriaCard key={materia.id} materia={materia} />
          ))}
        </section>
      )}
      {periodoAtual && (
        <div className="fixed bottom-6 right-6 z-50">
          {" "}
          <CreateMateriaDialog
            periodoId={periodoAtual.id}
            className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 p-0 [&_.button-text]:hidden"
          />
        </div>
      )}
    </main>
  );
}
