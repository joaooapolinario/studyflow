export interface Periodo {
    id: string;
    codigo: string;
    semestre: number;
}
export interface Nota {
  id: string;
  nome: string;
  valor: number;
  notaMaxima: number;
}

export interface Atividade {
  id: string;
  titulo: string;
  concluido: boolean;
  dataEntrega: string | null;
  observacao: string | null;
}

export interface Horario {
  id: string;
  diaSemana: number;
  inicio: string;
  fim: string;
  sala: string | null;
}

export interface Materia {
  id: string;
  nome: string;
  cor: string | null;
  professorNome: string | null;
  professorContato: string | null;

  notas: Nota[];
  atividades: Atividade[];
  horarios?: Horario[];
}