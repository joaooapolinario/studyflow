import { Injectable } from '@nestjs/common';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PeriodosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPeriodoDto: CreatePeriodoDto) {
    return await this.prisma.periodo.create({
      data: createPeriodoDto,
    });
  }
  
  async findAll() {
    return await this.prisma.periodo.findMany({
      orderBy: { semestre: 'asc' }
    });
  }

  async findOne(id: string) {
    return await this.prisma.periodo.findUnique({
      where: { id },
      include: {
        materias: {
          include: {
            notas: true
          }
        }
      }
    });
  }
  
  update(id: number, updatePeriodoDto: UpdatePeriodoDto) {
    return `This action updates a #${id} periodo`;
  }

  remove(id: number) {
    return `This action removes a #${id} periodo`;
  }
}
