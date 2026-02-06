'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface CreateMateriaDialogProps {
  periodoId: string;
  className?: string;
}

export function CreateMateriaDialog({ periodoId, className }: CreateMateriaDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    professorNome: '',
    professorContato: '',
    cor: '#3b82f6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get('token');

    if (!token) {
      alert('Sessão expirada. Por favor, faça login novamente.');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3333/materias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          periodoId,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao criar matéria');
      }

      setFormData({
        nome: '',
        professorNome: '',
        professorContato: '',
        cor: '#3b82f6',
      });
      setOpen(false);
      toast.success('Matéria criada com sucesso!');
      router.refresh(); 
      
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar matéria. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Plus className="h-6 w-6" />
          <span className="sr-only button-text">Nova Matéria</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Nova Matéria</DialogTitle>
          <DialogDescription>
            Adicione uma nova disciplina ao seu semestre.
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
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, professorNome: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, professorContato: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
              />
              <span className="text-sm text-muted-foreground">{formData.cor}</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Matéria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}