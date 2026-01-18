export class CreateAtividadeDto {
    titulo: string;
    materiaId: string;

    dataEntrega?: string;

    concluido?: boolean;
    observacao?: string;
}
