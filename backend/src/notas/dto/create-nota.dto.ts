import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateNotaDto {
    @IsString()
    @IsNotEmpty()
    nome: string;    // "ab1"

    @IsNumber()
    @IsOptional()
    valor?: number;  // 8.5

    @IsNumber()
    @IsNotEmpty()
    notaMaxima: number;  // 10.0

    @IsString()
    @IsNotEmpty()
    materiaId: string;  // vinculo com a materia
}