"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  materiaId: string;
}

export function CreateAtividadeDialog({ materiaId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [obs, setObs] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepara o JSON. Se tiver data, formata para ISO.
      const payload = {
        titulo,
        materiaId,
        dataEntrega: data ? new Date(data + "T00:00:00").toISOString() : null,
        observacao: obs
      };

      const res = await fetch("http://localhost:3333/atividades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setOpen(false);
        setTitulo("");
        setData("");
        setObs("");
        router.refresh(); // Atualiza a lista na hora
      }
    } catch (error) {
      console.error("Erro", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
            <DialogDescription>O que você precisa entregar?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Lista de Exercícios 01"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="data">Data de Entrega (Opcional)</Label>
              {/* Input nativo de data do navegador (mais simples e funciona bem no mobile) */}
              <Input
                id="data"
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
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
