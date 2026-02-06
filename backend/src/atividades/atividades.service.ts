import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AtividadesService {
  constructor(private prisma: PrismaService) {}

  async create(createAtividadeDto: CreateAtividadeDto, userId: string) {
    const materia = await this.prisma.materia.findUnique({
      where: { id: createAtividadeDto.materiaId },
      include: { periodo: true },
    });

    if (!materia || materia.periodo.userId !== userId) {
      throw new UnauthorizedException('Acesso negado a esta matéria.');
    }

    return await this.prisma.atividade.create({
      data: createAtividadeDto,
    });
  }

  private async verificarPosse(id: string, userId: string) {
    const atividade = await this.prisma.atividade.findUnique({
      where: { id },
      include: { materia: { include: { periodo: true } } },
    });

    if (!atividade || atividade.materia.periodo.userId !== userId) {
      throw new NotFoundException('Atividade não encontrada ou acesso negado.');
    }
    return atividade;
  }

  async update(id: string, updateAtividadeDto: UpdateAtividadeDto, userId: string) {
    await this.verificarPosse(id, userId);
    return await this.prisma.atividade.update({
      where: { id },
      data: updateAtividadeDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.verificarPosse(id, userId);
    return await this.prisma.atividade.delete({
      where: { id },
    });
  }
}