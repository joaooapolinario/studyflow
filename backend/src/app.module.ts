import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MateriasModule } from './materias/materias.module';
import { PeriodosModule } from './periodos/periodos.module';
import { AtividadesModule } from './atividades/atividades.module';
import { NotasModule } from './notas/notas.module';

@Module({
  imports: [PrismaModule, MateriasModule, PeriodosModule, AtividadesModule, NotasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
