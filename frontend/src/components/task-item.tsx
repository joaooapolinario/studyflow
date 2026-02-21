"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import {
  Calendar,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditAtividadeDialog } from "./edit-atividade-dialog";

interface TaskProps {
  id: string;
  titulo: string;
  concluido: boolean;
  dataEntrega: string | null;
  observacao: string | null;
  tipo: string;
}

export function TaskItem({
  id,
  titulo,
  concluido,
  dataEntrega,
  observacao,
  tipo,
}: TaskProps) {
  const router = useRouter();

  const [isDone, setIsDone] = useState(concluido);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function handleToggle(checked: boolean) {
    setIsDone(checked);
    setIsLoading(true);

    const token = Cookies.get("token");
    if (!token) return;

    try {
      const statusFinal = checked === true;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/atividades/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ concluido: statusFinal }),
      });

      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar checkbox", error);
      setIsDone(!checked);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja apagar esta tarefa?")) return;

    const token = Cookies.get("token");
    if (!token) return;

    try {
      await fetch(`process.env.NEXT_PUBLIC_API_URL/atividades/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.refresh();
    } catch (error) {
      console.error("Erro ao deletar", error);
      alert("Erro ao deletar tarefa.");
    }
  }

  const dataFormatada = dataEntrega
    ? new Date(dataEntrega).toLocaleDateString("pt-BR")
    : null;

  const isAtrasado =
    !isDone && dataEntrega && new Date(dataEntrega) < new Date();

  return (
    <>
      <div className="flex items-center justify-between p-4 gap-3 hover:bg-accent/30 transition-colors rounded-lg border border-transparent hover:border-border">
        {/* LADO ESQUERDO */}
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="relative flex items-center justify-center w-5 h-5">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Checkbox
                checked={isDone}
                onCheckedChange={(checked) => handleToggle(checked === true)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
            )}
          </div>

          <div className="flex-1 truncate">
            <p
              className={`font-medium transition-all truncate ${isDone ? "line-through text-muted-foreground" : ""}`}
            >
              {titulo}
            </p>

            {/* Mudamos aqui de observacao para descricao */}
            {observacao && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                📝 {observacao}
              </p>
            )}

            {dataFormatada && (
              <p
                className={`text-xs flex items-center gap-1 mt-2 ${isAtrasado ? "text-red-500 font-bold" : "text-muted-foreground"}`}
              >
                <Calendar className="h-3 w-3" />
                {dataFormatada}
                {isAtrasado && " (Atrasado)"}
              </p>
            )}
          </div>
        </div>

        {/* LADO DIREITO: Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* MODAL DE EDIÇÃO */}
      <EditAtividadeDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        atividade={{ id, titulo, dataEntrega, observacao, tipo }}
      />
    </>
  );
}
