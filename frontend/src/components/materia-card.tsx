"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { calcularEstatisticas } from "@/lib/calculations";
import { Materia } from "@/types";

interface MateriaCardProps {
  materia: Materia;
}

export function MateriaCard({ materia }: MateriaCardProps) {
  const router = useRouter();

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
    <Link href={`/materia/${materia.id}`} className="block group relative">
      <Card
        className={`border-l-4 shadow-lg hover:bg-accent/50 transition-colors cursor-pointer h-full flex flex-col`}
        style={{ borderLeftColor: materia.cor || "#3b82f6" }}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="overflow-hidden mr-2">
              <CardTitle className="text-lg truncate">{materia.nome}</CardTitle>
              <CardDescription className="truncate">
                {materia.professorNome || "Sem professor"}
              </CardDescription>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              {/* Badge dinâmico */}
              {stats.temNotas ? (
                <Badge variant="outline" className={corMedia}>
                  {stats.mediaAtual.toFixed(1)}
                </Badge>
              ) : (
                <Badge variant="secondary">Novo</Badge>
              )}
            </div>
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
}
