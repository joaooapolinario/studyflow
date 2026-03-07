"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditHorarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horario: any | null;
}

const DIAS_SEMANA = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function EditHorarioDialog({
  open,
  onOpenChange,
  horario,
}: EditHorarioDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [diaSemana, setDiaSemana] = useState<string>("1");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [sala, setSala] = useState("");

  useEffect(() => {
    if (horario) {
      setDiaSemana(String(horario.diaSemana));
      setInicio(horario.inicio);
      setFim(horario.fim);
      setSala(horario.sala || "");
    }
  }, [horario]);

  const handleEditHorario = async () => {
    if (!horario) return;
    setLoading(true);

    try {
      await api.patch(`/horarios/${horario.id}`, {
        diaSemana: parseInt(diaSemana),
        inicio,
        fim,
        sala,
      });

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar horário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Horário</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Dia da Semana</Label>
            <Select onValueChange={setDiaSemana} value={diaSemana}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {DIAS_SEMANA.map((dia, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {dia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Início</Label>
              <Input
                type="time"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Fim</Label>
              <Input
                type="time"
                value={fim}
                onChange={(e) => setFim(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sala (Opcional)</Label>
            <Input
              placeholder="Ex: Sala 102, Lab 3..."
              value={sala}
              onChange={(e) => setSala(e.target.value)}
            />
          </div>
        </div>
        <Button
          className="w-full"
          onClick={handleEditHorario}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
