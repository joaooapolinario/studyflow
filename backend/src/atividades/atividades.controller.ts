import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AtividadesService } from './atividades.service';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('atividades')
export class AtividadesController {
  constructor(private readonly atividadesService: AtividadesService) {}

  @Post()
  create(@Body() createAtividadeDto: CreateAtividadeDto, @Request() req: any) {
    return this.atividadesService.create(createAtividadeDto, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtividadeDto: UpdateAtividadeDto, @Request() req: any) {
    return this.atividadesService.update(id, updateAtividadeDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.atividadesService.remove(id, req.user.userId);
  }
}