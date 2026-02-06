"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // <--- Importante
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Trash2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Tipagem (Replicando a que usamos na Home para consistência)
interface Horario {
  id: string;
  diaSemana: number;
  inicio: string;
  fim: string;
  sala: string | null;
}

interface Materia {
  id: string;
  nome: string;
  cor: string | null;
  horarios: Horario[];
}

interface ScheduleDialogProps {
  materias: Materia[];
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

export function ScheduleDialog({ materias }: ScheduleDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [selectedMateria, setSelectedMateria] = useState<string>("");
  const [diaSemana, setDiaSemana] = useState<string>("1"); // Default: Segunda
  const [inicio, setInicio] = useState("08:00");
  const [fim, setFim] = useState("10:00");
  const [sala, setSala] = useState("");

  // Ação 1: Adicionar Horário
  const handleAddHorario = async () => {
    if (!selectedMateria) return;
    setLoading(true);

    const token = Cookies.get("token");
    if (!token) {
        alert("Sessão expirada");
        return;
    }

    try {
      const res = await fetch("http://localhost:3333/horarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // <--- Token
        },
        body: JSON.stringify({
          diaSemana: parseInt(diaSemana),
          inicio,
          fim,
          sala,
          materiaId: selectedMateria,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar horário");

      // Limpa campos mas mantém a matéria selecionada para adicionar mais
      setSala("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar horário");
    } finally {
      setLoading(false);
    }
  };

  // Ação 2: Deletar Horário
  const handleDeleteHorario = async (id: string) => {
    if (!confirm("Remover este horário?")) return;
    
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3333/horarios/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`, // <--- Token
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao remover horário");
    }
  };

  // Agrupa horários por dia para exibição
  const horariosPorDia = DIAS_SEMANA.map((dia, index) => {
    const horariosDoDia = materias.flatMap((m) =>
      m.horarios
        .filter((h) => h.diaSemana === index)
        .map((h) => ({ ...h, materia: m }))
    );
    // Ordena por horário de início
    horariosDoDia.sort((a, b) => a.inicio.localeCompare(b.inicio));
    return { dia, index, horarios: horariosDoDia };
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Clock className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Quadro de Horários</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="visao_geral" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visao_geral">Visão Semanal</TabsTrigger>
            <TabsTrigger value="adicionar">Adicionar Horário</TabsTrigger>
          </TabsList>

          {/* ABA 1: VISUALIZAR */}
          <TabsContent value="visao_geral" className="flex-1 overflow-y-auto mt-4 pr-2">
            <div className="space-y-6">
              {horariosPorDia.map((item) => (
                <div key={item.index} className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground border-b pb-1">
                    {item.dia}
                  </h3>
                  {item.horarios.length === 0 ? (
                    <p className="text-xs text-muted-foreground/50 italic pl-2">
                      Livre
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {item.horarios.map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between p-3 rounded-md border bg-card text-card-foreground shadow-sm"
                          style={{ borderLeft: `4px solid ${h.materia.cor || "#ccc"}` }}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{h.materia.nome}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{h.inicio} - {h.fim}</span>
                                {h.sala && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {h.sala}
                                    </span>
                                )}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive/90"
                            onClick={() => handleDeleteHorario(h.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ABA 2: ADICIONAR */}
          <TabsContent value="adicionar" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Matéria</Label>
              <Select onValueChange={setSelectedMateria} value={selectedMateria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a matéria..." />
                </SelectTrigger>
                <SelectContent>
                  {materias.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <Button 
                className="w-full mt-4" 
                onClick={handleAddHorario} 
                disabled={loading || !selectedMateria}
            >
              {loading ? "Salvando..." : "Adicionar Horário"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}