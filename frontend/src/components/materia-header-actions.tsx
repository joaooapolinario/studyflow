"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditMateriaDialog } from "./edit-materia-dialog";
import { Materia } from "@/types";

interface Props {
  materia: Materia;
}

export function MateriaHeaderActions({ materia }: Props) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function handleDelete() {
    // Confirmação dupla para evitar acidentes
    if (
      !confirm(
        `TEM CERTEZA? Isso apagará a matéria "${materia.nome}" e TODAS as notas/tarefas dela.`,
      )
    )
      return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materias/${materia.id}`, {
        method: "DELETE",
      });
      router.push("/"); // Redireciona para a Home
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Editar Matéria
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Apagar Matéria
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditMateriaDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        materia={materia}
      />
    </>
  );
}
