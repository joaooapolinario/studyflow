import { Injectable } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}

  async create(createHorarioDto: CreateHorarioDto) {
    return await this.prisma.horarioAula.create({
      data: {
        diaSemana: Number(createHorarioDto.diaSemana),
        inicio: createHorarioDto.inicio,
        fim: createHorarioDto.fim,
        sala: createHorarioDto.sala,
        materiaId: createHorarioDto.materiaId,
      },
    });
  }

  findAll() {
    return `This action returns all horarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} horario`;
  }

  update(id: number, updateHorarioDto: UpdateHorarioDto) {
    return `This action updates a #${id} horario`;
  }

  async remove(id: string) {
    return await this.prisma.horarioAula.delete({
      where: { id },
    });
  }
}
