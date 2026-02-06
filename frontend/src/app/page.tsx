import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, BookOpen, Calendar, AlertCircle, Clock, User } from "lucide-react";
import { CreateMateriaDialog } from "@/components/create-materia-dialog";
import { calcularEstatisticas } from "@/lib/calculations";
import { ScheduleDialog } from "@/components/schedule-diaog";
import { UserNav } from "@/components/user-nav";

interface Materia {
  id: string
  nome: string
  cor: string | null
  professorNome: string | null
  professorContato: string | null
  

  horarios: {
    id: string
    diaSemana: number
    inicio: string
    fim: string
    sala: string | null
  }[]
  
  notas: {
    id: string
    nome: string
    valor: number | null
    notaMaxima: number
  }[]
  
  atividades: {
    id: string
    concluido: boolean
  }[]
}

interface Periodo {
  id: string;
  codigo: string;
  semestre: number;
}
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
  } catch (err) {
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
          {materias.map((materia) => {
            const stats = calcularEstatisticas(
              materia.notas || [],
              materia.atividades || [],
            );

            // Cor dinâmica da média (Verde se > 7, Amarelo se > 5, Vermelho se < 5)
            const corMedia =
              stats.mediaAtual >= 7
                ? "text-green-600"
                : stats.mediaAtual >= 5
                  ? "text-yellow-600"
                  : "text-red-600";

            return (
              <Link
                href={`/materia/${materia.id}`}
                key={materia.id}
                className="block"
              >
                <Card
                  className={`border-l-4 shadow-lg hover:bg-accent/50 transition-colors cursor-pointer h-full flex flex-col`}
                  style={{ borderLeftColor: materia.cor || "#3b82f6" }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="overflow-hidden">
                        <CardTitle className="text-lg truncate">
                          {materia.nome}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {materia.professorNome || "Sem professor"}
                        </CardDescription>
                      </div>
                      {/* Badge dinâmico */}
                      {stats.temNotas ? (
                        <Badge variant="outline" className={corMedia}>
                          {stats.mediaAtual.toFixed(1)}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Novo</Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2 flex-1">
                    <div className="flex justify-between text-sm mb-2 mt-2">
                      <span className="text-muted-foreground">Tarefas</span>
                      <span className="font-bold">
                        {Math.round(stats.progressoTarefas)}%
                      </span>
                    </div>
                    {/* Barra de progresso baseada nas tarefas concluídas */}
                    <Progress value={stats.progressoTarefas} className="h-2" />
                  </CardContent>

                  <CardFooter className="pt-4">
                    <div className="text-xs text-muted-foreground flex gap-1 items-center">
                      <BookOpen className="h-3 w-3" />
                      {stats.tarefasPendentes === 0
                        ? "Tudo em dia!"
                        : `${stats.tarefasPendentes} pendências`}
                    </div>
                  </CardFooter>
                </Card>
                
              </Link>
            );
          })}
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
