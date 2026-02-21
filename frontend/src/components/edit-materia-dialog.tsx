"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Materia } from "@/types";

interface EditMateriaDialogProps {
  materia: Materia;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMateriaDialog({
  materia,
  open,
  onOpenChange,
}: EditMateriaDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    professorNome: "",
    professorContato: "",
    cor: "#3b82f6",
  });

  // Load materia data when dialog opens
  useEffect(() => {
    if (open && materia) {
      setFormData({
        nome: materia.nome || "",
        professorNome: materia.professorNome || "",
        professorContato: materia.professorContato || "",
        cor: materia.cor || "#3b82f6",
      });
    }
  }, [open, materia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("token");

    if (!token) {
      alert("Sessão expirada. Por favor, faça login novamente.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/materias/${materia.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: formData.nome,
            professorNome: formData.professorNome || null,
            professorContato: formData.professorContato || null,
            cor: formData.cor,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Erro ao atualizar matéria");
      }

      toast.success("Matéria atualizada com sucesso!");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar matéria. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Editar Matéria</DialogTitle>
          <DialogDescription>
            Atualize as informações da disciplina.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nome" className="text-right">
              Nome
            </Label>
            <Input
              id="nome"
              required
              className="col-span-3"
              placeholder="Ex: Cálculo I"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="professor" className="text-right">
              Professor
            </Label>
            <Input
              id="professor"
              className="col-span-3"
              placeholder="Nome do professor"
              value={formData.professorNome}
              onChange={(e) =>
                setFormData({ ...formData, professorNome: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contato" className="text-right">
              Contato
            </Label>
            <Input
              id="contato"
              className="col-span-3"
              placeholder="Email ou Sala"
              value={formData.professorContato}
              onChange={(e) =>
                setFormData({ ...formData, professorContato: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cor" className="text-right">
              Cor
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="cor"
                type="color"
                className="w-12 h-10 p-1 cursor-pointer"
                value={formData.cor}
                onChange={(e) =>
                  setFormData({ ...formData, cor: e.target.value })
                }
              />
              <span className="text-sm text-muted-foreground">
                {formData.cor}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
