"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  materia: {
    id: string
    nome: string
    professorNome: string | null
    professorEmail: string | null
    cor: string | null
  }
}

export function EditMateriaDialog({ open, onOpenChange, materia }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [nome, setNome] = useState(materia.nome)
  const [prof, setProf] = useState(materia.professorNome || "")
  const [contato, setContato] = useState(materia.professorEmail || "")

  useEffect(() => {
    if (open) {
      setNome(materia.nome)
      setProf(materia.professorNome || "")
      setContato(materia.professorEmail || "")
    }
  }, [open, materia])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`http://localhost:3333/materias/${materia.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            nome, 
            professorNome: prof,
            professorEmail: contato
        })
      })
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader><DialogTitle>Editar Matéria</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome da Matéria</Label>
              <Input value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Nome do Professor</Label>
              <Input value={prof} onChange={e => setProf(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Contato (Email/Zap)</Label>
              <Input value={contato} onChange={e => setContato(e.target.value)} placeholder="Ex: prof@email.com" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}