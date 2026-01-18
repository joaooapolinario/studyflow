import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateAtividadeDialog } from "@/components/create-atividade-dialog";
import { CreateNotaDialog } from "@/components/create-nota-dialog";
import { TaskItem } from "@/components/task-item";
import { NotaItem } from "@/components/nota-item";
import { calcularEstatisticas } from "@/lib/calculations";
import { MateriaHeaderActions } from "@/components/materia-header-actions";

// Interface dos dados
interface MateriaDetalhada {
  id: string;
  nome: string;
  professorNome: string;
  professorEmail: string | null;
  cor: string;
  notas: {
    id: string;
    nome: string;
    valor: number | null;
    notaMaxima: number;
  }[];
  atividades: {
    id: string;
    titulo: string;
    concluido: boolean;
    dataEntrega: string;
    observacao: string | null;
  }[];
}

async function getMateria(id: string) {
  try {
    const res = await fetch(`http://localhost:3333/materias/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar materia:", error);
    return null;
  }
}

// CORREÇÃO AQUI: Definimos params como uma Promise
type Props = {
  params: Promise<{ id: string }>;
};

export default async function MateriaPage(props: Props) {
  // 1. Desembrulhamos o params com await antes de usar
  const params = await props.params;
  const id = params.id;

  // 2. Agora buscamos a matéria usando o ID correto
  const materia: MateriaDetalhada = await getMateria(id);

  if (!materia) {
    return notFound();
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

        {/* Título e Info central */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div
              className={`w-4 h-8 rounded-sm ${materia.cor || "bg-blue-500"}`}
            ></div>
            {materia.nome}
          </h1>
          <div className="flex flex-col text-muted-foreground">
            <span>{materia.professorNome || "Sem professor"}</span>
            {/* Mostra contato se existir */}
            {materia.professorEmail && (
              <span className="text-xs text-blue-500">
                {materia.professorEmail}
              </span>
            )}
          </div>
        </div>

        {/* AQUI ENTRA O MENU DE AÇÕES */}
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
                <div className="p-8 text-center text-muted-foreground">
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
            {/* Card de Análise de Notas */}
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

                      {/* Feedback inteligente */}
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
