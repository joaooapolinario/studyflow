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
import Cookies from 'js-cookie';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast, Toaster } from "sonner";

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
  const [tipo, setTipo] = useState('Trabalho');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get('token');
    if (!token) return;

    try {
      // Prepara o JSON. Se tiver data, formata para ISO.
      const payload = {
        titulo,
        materiaId,
        dataEntrega: data ? new Date(data + "T00:00:00").toISOString() : null,
        observacao: obs,
        tipo
      };

      const res = await fetch("http://localhost:3333/atividades", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao salvar');
      setOpen(false);
      setTitulo("");
      setData("");
      setObs("");
      router.refresh();
      
    } catch (error) {
      console.error("Erro", error);
      toast.error('Erro ao criar tarefa')
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Atividade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input placeholder="Ex: Lista de Exercícios 01" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Prova">Prova</SelectItem>
                        <SelectItem value="Trabalho">Trabalho</SelectItem>
                        <SelectItem value="Lista">Lista</SelectItem>
                        <SelectItem value="Seminário">Seminário</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>Data de Entrega</Label>
                <Input type="date" value={data} onChange={e => setData(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Descrição (Opcional)</Label>
            <Textarea placeholder="Detalhes da tarefa..." value={obs} onChange={e => setObs(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Criar Tarefa'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
