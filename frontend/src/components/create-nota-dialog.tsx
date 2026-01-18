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

interface Props {
  materiaId: string
}

export function CreateNotaDialog({ materiaId }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [nome, setNome] = useState("")
  const [valor, setValor] = useState("")
  const [max, setMax] = useState("10")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("http://localhost:3333/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          materiaId,
          // Se o valor estiver vazio, manda null (nota pendente). Se tiver valor, converte pra numero.
          valor: valor === "" ? null : parseFloat(valor.replace(",", ".")),
          notaMaxima: parseFloat(max)
        })
      })

      if (res.ok) {
        setOpen(false)
        setNome("")
        setValor("")
        router.refresh()
      }
    } catch (error) {
      console.error("Erro", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2"/> Lançar Nota</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Lançar Nota</DialogTitle>
            <DialogDescription>Registre uma avaliação (AB1, Final, etc).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Avaliação</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: AB1"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valor">Nota Obtida</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.1"
                  placeholder="Vazio se pendente"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max">Nota Máxima</Label>
                <Input
                  id="max"
                  type="number"
                  step="0.1"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}