import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    nome: string;

    @IsEmail({}, { message: 'O e-mail informado é inválido' })
    email: string;

    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @MinLength(6, { message: 'A senha precisa ter no mínimo 6 caracteres' })
    senha: string;

}