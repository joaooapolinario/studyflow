export interface Periodo {
    id: string;
    codigo: string;
    semestre: number;
}

export interface Materia {
    id: string;
    nome: string;
    professorNome?: string;
    cor: string;
    periodoId: string;

    mediaAtual?: number;
    progresso?: number;
}
