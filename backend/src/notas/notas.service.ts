import { Injectable } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNotaDto: CreateNotaDto) {
    return await this.prisma.nota.create({
      data: createNotaDto,
    });
  }

  async findAllByMateria(materiaId: string) {
    return await this.prisma.nota.findMany({
      where: { materiaId }
    });
  }


  findAll() {
    return `This action returns all notas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nota`;
  }

  async update(id: string, updateNotaDto: UpdateNotaDto) {
    return await this.prisma.nota.update({
      where: { id },
      data: updateNotaDto
    });
  }

  remove(id: number) {
    return `This action removes a #${id} nota`;
  }
}
