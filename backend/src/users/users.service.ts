import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('Email já cadastrado.');
    }

    // Criptografa a senha (Hash)
    // O '10' é o custo do processamento (Salt rounds). Quanto maior, mais seguro e mais lento.
    const hashedPassword = await bcrypt.hash(data.senha, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        senha: hashedPassword,
      },
    });

    // Retorna o usuário SEM a senha (segurança no retorno da API)
    const { senha, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}