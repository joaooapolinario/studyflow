"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Horario {
  id: string
  diaSemana: number
  inicio: string
  fim: string
  sala: string | null
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  materiaId: string
  horarios: Horario[]
}

const DIAS_SEMANA = [
  "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
]

export function ManageSchedulesDialog({ open, onOpenChange, materiaId, horarios }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Estados do Formulário
  const [dia, setDia] = useState<string>("")
  const [inicio, setInicio] = useState("")
  const [fim, setFim] = useState("")
  const [sala, setSala] = useState("")

  // Função 1: Adicionar Horário
  async function handleAdd() {
    if (!dia || !inicio || !fim) return // Validação simples
    setLoading(true)

    try {
      await fetch("http://localhost:3333/horarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materiaId,
          diaSemana: parseInt(dia), // O backend espera número
          inicio,
          fim,
          sala
        })
      })
      
      // Limpa o form e atualiza
      setInicio("")
      setFim("")
      setSala("")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Função 2: Apagar Horário
  async function handleDelete(id: string) {
    // Não precisa de loading global aqui para ser mais fluido, mas poderia por.
    try {
      await fetch(`http://localhost:3333/horarios/${id}`, {
        method: "DELETE",
      })
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Horários</DialogTitle>
          <DialogDescription>
            Adicione os dias e locais das aulas desta matéria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 1. LISTA DE HORÁRIOS EXISTENTES */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dia</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead className="w-12.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {horarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      Nenhum horário cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  horarios.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-medium">{DIAS_SEMANA[h.diaSemana]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {h.inicio} - {h.fim}
                        </div>
                      </TableCell>
                      <TableCell>
                         {h.sala ? (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                {h.sala}
                            </div>
                         ) : "-"}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(h.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 2. FORMULÁRIO DE ADIÇÃO */}
          <div className="bg-muted/40 p-4 rounded-lg space-y-3 border">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Novo Horário
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Select de Dias */}
                <div className="space-y-1">
                    <Label className="text-xs">Dia</Label>
                    <Select onValueChange={setDia} value={dia}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                            {DIAS_SEMANA.map((nome, index) => (
                                <SelectItem key={index} value={String(index)}>
                                    {nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Horas */}
                <div className="space-y-1">
                    <Label className="text-xs">Início</Label>
                    <Input type="time" value={inicio} onChange={e => setInicio(e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Fim</Label>
                    <Input type="time" value={fim} onChange={e => setFim(e.target.value)} />
                </div>

                {/* Sala */}
                <div className="space-y-1">
                    <Label className="text-xs">Sala (Opcional)</Label>
                    <Input placeholder="Sala 1" value={sala} onChange={e => setSala(e.target.value)} />
                </div>
            </div>

            <Button onClick={handleAdd} disabled={loading || !dia || !inicio} className="w-full mt-2">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adicionar Horário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}