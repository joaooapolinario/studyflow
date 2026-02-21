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
        className={`border-l-4 shadow-sm hover:shadow-md hover:bg-accent/50 transition-all cursor-pointer h-full flex flex-col`}
        style={{ borderLeftColor: materia.cor || "#3b82f6" }}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            <div className="overflow-hidden">
              <CardTitle className="text-base font-semibold truncate leading-tight">
                {materia.nome}
              </CardTitle>
              <CardDescription className="truncate text-xs mt-1">
                {materia.professorNome || "Sem professor"}
              </CardDescription>
            </div>

            <div className="flex flex-col items-end shrink-0">
              {stats.temNotas ? (
                <Badge
                  variant="outline"
                  className={`${corMedia} text-xs px-1.5 py-0 h-5`}
                >
                  {stats.mediaAtual.toFixed(1)}
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-5"
                >
                  Novo
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 pb-2 flex-1">
          <div className="flex justify-between text-xs mb-1.5 items-center">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">
              {Math.round(stats.progressoTarefas)}%
            </span>
          </div>
          <Progress value={stats.progressoTarefas} className="h-1.5" />
        </CardContent>

        <CardFooter className="p-4 pt-2">
          <div className="text-[10px] text-muted-foreground flex gap-1.5 items-center">
            <BookOpen className="h-3 w-3" />
            <span>
              {stats.tarefasPendentes === 0
                ? "Tudo em dia"
                : `${stats.tarefasPendentes} pendências`}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
