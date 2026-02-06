import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreatePeriodoDto {
  @IsNotEmpty()
  @IsString()
  codigo: string; 

  @IsNotEmpty()
  @IsInt()
  semestre: number; 

  @IsOptional()
  userId?: string; 
}