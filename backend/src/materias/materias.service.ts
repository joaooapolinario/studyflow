import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaService) {}

  async create(createMateriaDto: CreateMateriaDto, userId: string) {
    const periodo = await this.prisma.periodo.findUnique({
      where: { id: createMateriaDto.periodoId },
    });

    if (!periodo || periodo.userId !== userId) {
      throw new UnauthorizedException('Você não tem permissão neste período.');
    }

    return await this.prisma.materia.create({
      data: createMateriaDto,
    });
  }

  async findAll(userId: string) {
    return await this.prisma.materia.findMany({
      where: {
        periodo: { userId: userId },
      },
      include: {
        notas: true,
        atividades: true,
        horarios: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const materia = await this.prisma.materia.findUnique({
      where: { id },
      include: { notas: true, atividades: true, horarios: true, periodo: true },
    });

    if (!materia || materia.periodo.userId !== userId) {
      throw new NotFoundException('Matéria não encontrada.');
    }

    return materia;
  }

  async update(id: string, updateMateriaDto: UpdateMateriaDto, userId: string) {
    await this.findOne(id, userId); 
    
    return await this.prisma.materia.update({
      where: { id },
      data: updateMateriaDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return await this.prisma.materia.delete({
      where: { id },
    });
  }
}