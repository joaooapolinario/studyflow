import { Injectable } from '@nestjs/common';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AtividadesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAtividadeDto: CreateAtividadeDto) {
    return await this.prisma.atividade.create({
      data: {
        titulo: createAtividadeDto.titulo,
        materiaId: createAtividadeDto.materiaId,
        concluido: createAtividadeDto.concluido || false,
        dataEntrega: createAtividadeDto.dataEntrega,
        observacao: createAtividadeDto.observacao,
      },
    });
  }

  async findAllByMateria(materiaId: string) {
    return await this.prisma.atividade.findMany({
      where: { materiaId },
      orderBy: { dataEntrega: 'asc' }
    });
  }


  findAll() {
    return `This action returns all atividades`;
  }

  findOne(id: string) {
    return this.prisma.atividade.findUnique({ where: { id } });
  }

  async update(id: string, updateAtividadeDto: UpdateAtividadeDto) {
    return await this.prisma.atividade.update({
      where: { id },
      data: updateAtividadeDto,
    });
  }

  remove(id: string) {
    return this.prisma.atividade.delete({ where: { id } });
  }
}
