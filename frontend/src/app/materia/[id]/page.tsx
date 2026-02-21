import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CreateAtividadeDialog } from "@/components/create-atividade-dialog";
import { CreateNotaDialog } from "@/components/create-nota-dialog";
import { TaskItem } from "@/components/task-item";
import { NotaItem } from "@/components/nota-item";
import { calcularEstatisticas } from "@/lib/calculations";
import { MateriaHeaderActions } from "@/components/materia-header-actions";

interface Materia {
  id: string;
  nome: string;
  cor: string | null;
  professorNome: string | null;
  professorContato: string | null;
  notas: {
    id: string;
    nome: string;
    valor: number;
    notaMaxima: number;
  }[];
  atividades: {
    id: string;
    titulo: string;
    observacao: string | null;
    dataEntrega: string | null;
    concluido: boolean;
    tipo: string;
  }[];
}

async function getMateria(id: string, token: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materias/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Erro ao buscar matéria");

    return (await res.json()) as Materia;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function MateriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const materia = await getMateria(id, token);

  if (!materia) {
    notFound();
  }

  const stats = calcularEstatisticas(materia.notas, materia.atividades);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div
              className={`w-4 h-8 rounded-sm ${materia.cor || "bg-blue-500"}`}
            ></div>
            {materia.nome}
          </h1>
          <div className="flex flex-col text-muted-foreground">
            <span>{materia.professorNome || "Sem professor"}</span>
            {materia.professorContato && (
              <span className="text-xs text-blue-500">
                {materia.professorContato}
              </span>
            )}
          </div>
        </div>

        <MateriaHeaderActions materia={materia} />
      </div>

      <Tabs defaultValue="tarefas" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-100">
          <TabsTrigger value="tarefas">Tarefas & Prazos</TabsTrigger>
          <TabsTrigger value="notas">Notas & Médias</TabsTrigger>
        </TabsList>

        <TabsContent value="tarefas" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Minhas Atividades</h2>
            <CreateAtividadeDialog materiaId={materia.id} />
          </div>

          <Card>
            <CardContent className="p-0">
              {materia.atividades.length === 0 ? (
                <div className="text-muted-foreground italic">
                  Nenhuma tarefa pendente.
                </div>
              ) : (
                <div className="divide-y">
                  {materia.atividades.map((task) => (
                    <TaskItem
                      key={task.id}
                      id={task.id}
                      titulo={task.titulo}
                      concluido={task.concluido}
                      dataEntrega={task.dataEntrega}
                      observacao={task.observacao}
                      tipo={task.tipo}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notas" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Boletim</h2>
            <CreateNotaDialog materiaId={materia.id} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avaliações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {materia.notas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma nota lançada.
                  </p>
                ) : (
                  materia.notas.map((nota) => (
                    <NotaItem
                      key={nota.id}
                      id={nota.id}
                      nome={nota.nome}
                      valor={nota.valor}
                      notaMaxima={nota.notaMaxima}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-dashed flex flex-col justify-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-center">
                  Desempenho Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-2">
                  {stats.temNotas ? (
                    <>
                      <span
                        className={`text-5xl font-bold ${stats.mediaAtual >= 7 ? "text-green-500" : "text-orange-500"}`}
                      >
                        {stats.mediaAtual.toFixed(1)}
                      </span>
                      <p className="text-sm text-muted-foreground mt-2">
                        Média baseada em {stats.totalPontosPossiveis} pontos
                        distribuídos
                      </p>

                      <div className="mt-4 p-2 bg-background rounded border text-xs">
                        {stats.mediaAtual >= 7
                          ? "🚀 Você está na média! Continue assim."
                          : "⚠️ Atenção! Precisa melhorar nas próximas."}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <span className="text-4xl">--</span>
                      <p>Lance a primeira nota para calcular.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
