"use client";

import { useState } from "react";
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
import { api } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nota: {
    id: string;
    nome: string;
    valor: number | null;
    notaMaxima: number;
  };
}

export function EditNotaDialog({ open, onOpenChange, nota }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState(nota.nome);
  const [valor, setValor] = useState(
    nota.valor !== null ? String(nota.valor) : "",
  );
  const [max, setMax] = useState(String(nota.notaMaxima));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.patch(`/notas/${nota.id}`, {
        nome,
        valor: valor === "" ? null : parseFloat(valor.replace(",", ".")),
        notaMaxima: parseFloat(max),
      });

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao editar nota", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Nota</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias na tarefa abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome-nota">Nome da Avaliação</Label>
              <Input
                id="edit-nome-nota"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-valor">Nota Obtida</Label>
                <Input
                  id="edit-valor"
                  type="number"
                  step="0.1"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-max">Nota Máxima</Label>
                <Input
                  id="edit-max"
                  type="number"
                  step="0.1"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
