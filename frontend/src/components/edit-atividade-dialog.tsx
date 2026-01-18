"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  atividade: {
    id: string;
    titulo: string;
    dataEntrega: string | null;
    observacao: string | null;
  };
}

export function EditAtividadeDialog({ open, onOpenChange, atividade }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados iniciam com os valores atuais da tarefa
  const [titulo, setTitulo] = useState(atividade.titulo);
  // Formata a data para o input (yyyy-MM-dd) se ela existir
  const [data, setData] = useState(
    atividade.dataEntrega
      ? new Date(atividade.dataEntrega).toISOString().split("T")[0]
      : "",
  );
  const [obs, setObs] = useState(atividade.observacao || "");

  useEffect(() => {
    if (open) {
      setTitulo(atividade.titulo);
      setObs(atividade.observacao || "");
      setData(
        atividade.dataEntrega
          ? new Date(atividade.dataEntrega).toISOString().split("T")[0]
          : "",
      );
    }
  }, [open, atividade]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`http://localhost:3333/atividades/${atividade.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          // Truque do fuso horário novamente
          dataEntrega: data ? new Date(data + "T00:00:00").toISOString() : null,
          observacao: obs,
        }),
      });

      router.refresh();
      onOpenChange(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao editar", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>

            <DialogDescription>
              Faça as alterações necessárias na tarefa abaixo.
            </DialogDescription>
            
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-titulo">Título</Label>
              <Input
                id="edit-titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-data">Data de Entrega</Label>
              <Input
                id="edit-data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="obs">Observações (Assuntos, Capítulos...)</Label>
              <Textarea
                id="obs"
                placeholder="Ex: Estudar Cap 4, Trazer calculadora..."
                value={obs}
                onChange={(e) => setObs(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
