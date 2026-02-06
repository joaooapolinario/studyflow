import { Injectable } from '@nestjs/common';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PeriodosService {
  constructor(private prisma: PrismaService) {}

  async create(createPeriodoDto: CreatePeriodoDto, userId: string) {
    return await this.prisma.periodo.create({
      data: {
        ...createPeriodoDto,
        userId: userId,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.periodo.findMany({
      where: { userId: userId },
      include: {
        materias: {
          include: {
            notas: true,
            atividades: true,
            horarios: true,
          }
        }
      }
    });
  }

  async findOne(id: string) {
    return await this.prisma.periodo.findUnique({
      where: { id },
      include: { materias: true },
    });
  }

  async update(id: string, updatePeriodoDto: UpdatePeriodoDto) {
    return await this.prisma.periodo.update({
      where: { id },
      data: updatePeriodoDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.periodo.delete({
      where: { id },
    });
  }
}