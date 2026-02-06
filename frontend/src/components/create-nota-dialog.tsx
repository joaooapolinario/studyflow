"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function CreateNotaDialog({ materiaId }: { materiaId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [notaMaxima, setNotaMaxima] = useState("10");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("token");
    if (!token) return;

    try {
      const valorFloat = parseFloat(valor) || 0;
      const maxFloat = parseFloat(notaMaxima) || 10;

      const res = await fetch("http://localhost:3333/notas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          valor: valorFloat, 
          notaMaxima: maxFloat, 
          materiaId,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      setOpen(false);
      setNome("");
      setValor("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar nota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nova Nota
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nota</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Prova 1"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Minha Nota</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="8.5"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Valor Máximo</Label>
              <Input
                type="number"
                step="0.1"
                value={notaMaxima}
                onChange={(e) => setNotaMaxima(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : "Adicionar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
