"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, Clock, MapPin } from "lucide-react"

// Interfaces atualizadas para a nova estrutura de dados
interface Horario {
  id: string
  diaSemana: number
  inicio: string
  fim: string
  sala: string | null
}

interface MateriaResumo {
  id: string
  nome: string
  cor: string | null
  horarios: Horario[] // <--- Agora é uma lista, não mais texto
}

interface Props {
  materias: MateriaResumo[]
}

const DIAS_MAP = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

export function ScheduleDialog({ materias }: Props) {
  // LÓGICA:
  // 1. "Achatar" a lista: Em vez de lista de matérias, queremos uma lista de AULAS.
  const todasAulas = materias.flatMap(materia => 
    materia.horarios.map(horario => ({
      ...horario,
      materiaNome: materia.nome,
      materiaCor: materia.cor
    }))
  )

  // 2. Ordenar: Primeiro pelo Dia da Semana, depois pelo Horário
  todasAulas.sort((a, b) => {
    if (a.diaSemana !== b.diaSemana) {
      return a.diaSemana - b.diaSemana
    }
    return a.inicio.localeCompare(b.inicio)
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* O botão que fica na Home */}
        <Button variant="outline" className="gap-2">
          <CalendarDays className="h-4 w-4" /> Meu Horário
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Grade Semanal</DialogTitle>
          <DialogDescription>
            Visualização completa das suas aulas.
          </DialogDescription>
        </DialogHeader>
        
        {todasAulas.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-lg m-4">
            <p>Nenhuma aula encontrada.</p>
            <p className="text-sm mt-1">Cadastre os horários dentro de cada matéria.</p>
          </div>
        ) : (
          <div className="overflow-y-auto border rounded-md mt-2">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow>
                  <TableHead className="w-25">Dia</TableHead>
                  <TableHead className="w-35">Horário</TableHead>
                  <TableHead>Matéria</TableHead>
                  <TableHead>Sala</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todasAulas.map((aula) => (
                  <TableRow key={aula.id}>
                    <TableCell className="font-medium bg-muted/10 text-primary">
                      {DIAS_MAP[aula.diaSemana]}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm font-mono text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {aula.inicio} - {aula.fim}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        <div 
                          className="w-3 h-3 rounded-full shadow-sm" 
                          style={{ backgroundColor: aula.materiaCor || '#3b82f6' }} 
                        />
                        {aula.materiaNome}
                      </div>
                    </TableCell>
                    <TableCell>
                      {aula.sala ? (
                        <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {aula.sala}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}