import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAtividadeDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @IsDateString()
  dataEntrega?: string;

  @IsNotEmpty()
  @IsString()
  tipo: string;

  @IsOptional()
  @IsBoolean()
  concluido?: boolean;

  @IsNotEmpty()
  @IsUUID()
  materiaId: string;
}
