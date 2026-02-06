import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  create(@Body() createNotaDto: CreateNotaDto, @Request() req: any) {
    return this.notasService.create(createNotaDto, req.user.userId);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotaDto: UpdateNotaDto, @Request() req: any) {
    return this.notasService.update(id, updateNotaDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.notasService.remove(id, req.user.userId);
  }
}