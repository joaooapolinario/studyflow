"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditNotaDialog } from "./edit-nota-dialog";

interface NotaProps {
  id: string;
  nome: string;
  valor: number | null;
  notaMaxima: number;
}

export function NotaItem({ id, nome, valor, notaMaxima }: NotaProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja apagar a nota "${nome}"?`)) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notas/${id}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0 pt-3 first:pt-0">
        <span className="font-medium">{nome}</span>

        <div className="flex items-center gap-3">
          {/* O Badge com a nota */}
          <Badge
            variant={
              valor !== null
                ? valor >= notaMaxima * 0.7
                  ? "default"
                  : "destructive"
                : "outline"
            }
          >
            {valor !== null ? valor.toFixed(1) : "-"} / {notaMaxima}
          </Badge>

          {/* O Menu de Ações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
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
      </div>

      <EditNotaDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        nota={{ id, nome, valor, notaMaxima }}
      />
    </>
  );
}
