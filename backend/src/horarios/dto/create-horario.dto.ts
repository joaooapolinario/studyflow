export class CreateHorarioDto {
    diaSemana: number;
    inicio: string;
    fim: string;
    sala?: string;
    materiaId: string;
}
