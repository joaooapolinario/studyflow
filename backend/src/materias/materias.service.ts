import { Injectable } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MateriasService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createMateriaDto: CreateMateriaDto) {
    return await this.prisma.materia.create({
      data: createMateriaDto,
    });
  }

  async findAll() {
    return await this.prisma.materia.findMany({
      include: {
        periodo: true,
        notas: true,
        atividades: true,
        horarios: true,
      }
    });
  }

  async findOne(id: string) {
    return await this.prisma.materia.findUnique({
      where: { id },
      include: {
        notas: true,
        atividades: {
          orderBy: { dataEntrega: 'asc'}
        },
        horarios: {
          orderBy: { diaSemana: 'asc'}
        }

      }
    });
  }

  async update(id: string, UpdateMateriaDto: UpdateMateriaDto) {
    return await this.prisma.materia.update({
      where: { id },
      data: UpdateMateriaDto,
    });
  }

  async remove(id: string){
    return await this.prisma.materia.delete({
      where: { id },
    });
  }

}
