import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateNotaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  valor: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  notaMaxima: number;

  @IsNotEmpty()
  @IsUUID()
  materiaId: string;
}