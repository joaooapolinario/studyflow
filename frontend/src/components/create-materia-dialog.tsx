"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

// Recebemos o ID do período atual como prop, pois a matéria precisa ser vinculada a ele
interface Props {
  periodoId: string,
  className?: string
}

export function CreateMateriaDialog({ periodoId, className}: Props) {
  const [open, setOpen] = useState(false) // Controla se a janela está aberta
  const [loading, setLoading] = useState(false) // Controla o estado de "Salvando..."
  const router = useRouter() // Para recarregar a página após salvar

  // Estados do formulário
  const [nome, setNome] = useState("")
  const [prof, setProf] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // Evita que a página recarregue sozinha
    setLoading(true)

    try {
      // Chama o Backend
      const res = await fetch("http://localhost:3333/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          professorNome: prof,
          periodoId: periodoId,
          cor: "#8b5cf6" // Roxo padrão por enquanto (depois podemos deixar escolher)
        })
      })

      if (res.ok) {
        setOpen(false) // Fecha o modal
        setNome("")    // Limpa o campo
        setProf("")    // Limpa o campo
        router.refresh() // <--- A Mágica: Atualiza a lista de matérias na tela sem F5
      }
    } catch (error) {
      console.error("Erro ao criar", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`gap-2 ${className}`}>
          <Plus className="h-4 w-4" /> 
          <span className="button-text">Nova Matéria</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Matéria</DialogTitle>
            <DialogDescription>
              Adicione uma disciplina ao seu período atual.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Arquitetura de Computadores"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prof" className="text-right">
                Professor
              </Label>
              <Input
                id="prof"
                value={prof}
                onChange={(e) => setProf(e.target.value)}
                placeholder="Ex: Linus Torvalds"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Matéria
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}