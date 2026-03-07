import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}

  async create(createHorarioDto: CreateHorarioDto, userId: string) {
    const materia = await this.prisma.materia.findUnique({
      where: { id: createHorarioDto.materiaId },
      include: { periodo: true },
    });

    if (!materia || materia.periodo.userId !== userId) {
      throw new UnauthorizedException('Acesso negado a esta matéria.');
    }

    return await this.prisma.horarioAula.create({
      data: createHorarioDto,
    });
  }

  async remove(id: string, userId: string) {
    const horario = await this.prisma.horarioAula.findUnique({
      where: { id },
      include: { materia: { include: { periodo: true } } },
    });

    if (!horario || horario.materia.periodo.userId !== userId) {
      throw new NotFoundException('Horário não encontrado ou acesso negado.');
    }

    return await this.prisma.horarioAula.delete({
      where: { id },
    });
  }

  async update(id: string, updateHorarioDto: UpdateHorarioDto, userId: string) {
    const horario = await this.prisma.horarioAula.findUnique({
      where: { id },
      include: { materia: { include: { periodo: true } } },
    });

    if (!horario || horario.materia.periodo.userId !== userId) {
      throw new NotFoundException('Horário não encontrado ou acesso negado.');
    }

    if (updateHorarioDto.materiaId && updateHorarioDto.materiaId !== horario.materiaId) {
      const novaMateria = await this.prisma.materia.findUnique({
        where: { id: updateHorarioDto.materiaId },
        include: { periodo: true },
      });

      if (!novaMateria || novaMateria.periodo.userId !== userId) {
        throw new UnauthorizedException('Acesso negado à nova matéria.');
      }
    }

    return await this.prisma.horarioAula.update({
      where: { id },
      data: updateHorarioDto,
    });
  }
}