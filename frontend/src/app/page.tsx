import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { MateriaCard } from "@/components/materia-card";
import { Materia, Periodo } from "@/types";
import { AlertCircle, Calendar } from "lucide-react";

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
    <AppShell materias={materias} periodoId={periodoAtual?.id}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Minhas Matérias
            </h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              {periodoAtual
                ? `${periodoAtual.codigo} • ${periodoAtual.semestre}º Semestre`
                : "Sem período ativo"}
            </p>
          </div>
        </div>

        {materias.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border rounded-lg border-dashed text-muted-foreground">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p>Nenhuma matéria encontrada.</p>
            <p className="text-sm">
              Use o botão "+" na barra de navegação para começar.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materias.map((materia) => (
              <MateriaCard key={materia.id} materia={materia} />
            ))}
          </section>
        )}
      </div>
    </AppShell>
  );
}
