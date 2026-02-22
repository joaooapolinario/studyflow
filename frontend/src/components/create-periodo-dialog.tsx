"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreatePeriodoDialogProps {
  className?: string;
}

export function CreatePeriodoDialog({ className }: CreatePeriodoDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    codigo: "",
    semestre: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/periodos", {
        codigo: formData.codigo,
        semestre: Number(formData.semestre),
      });

      setFormData({
        codigo: "",
        semestre: 1,
      });
      setOpen(false);
      toast.success("Período criado com sucesso!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar período. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Criar Período</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Período</DialogTitle>
          <DialogDescription>
            Adicione um novo período letivo (ex: 2024.1)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codigo" className="text-right">
              Código
            </Label>
            <Input
              id="codigo"
              required
              className="col-span-3"
              placeholder="Ex: 2024.1"
              value={formData.codigo}
              onChange={(e) =>
                setFormData({ ...formData, codigo: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="semestre" className="text-right">
              Semestre
            </Label>
            <Input
              id="semestre"
              type="number"
              min="1"
              max="14"
              required
              className="col-span-3"
              placeholder="Ex: 6"
              value={formData.semestre}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  semestre: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Período"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
