import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotasService {
  constructor(private prisma: PrismaService) {}

  async create(createNotaDto: CreateNotaDto, userId: string) {
    const materia = await this.prisma.materia.findUnique({
      where: { id: createNotaDto.materiaId },
      include: { periodo: true },
    });

    if (!materia || materia.periodo.userId !== userId) {
      throw new UnauthorizedException('Acesso negado a esta matéria.');
    }

    return await this.prisma.nota.create({
      data: createNotaDto,
    });
  }

  private async verificarPosse(id: string, userId: string) {
    const nota = await this.prisma.nota.findUnique({
      where: { id },
      include: { materia: { include: { periodo: true } } },
    });
    
    if (!nota || nota.materia.periodo.userId !== userId) {
      throw new NotFoundException('Nota não encontrada.');
    }
    return nota;
  }

  async update(id: string, updateNotaDto: UpdateNotaDto, userId: string) {
    await this.verificarPosse(id, userId);
    return await this.prisma.nota.update({
      where: { id },
      data: updateNotaDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.verificarPosse(id, userId);
    return await this.prisma.nota.delete({
      where: { id },
    });
  }
}