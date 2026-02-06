import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
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
}