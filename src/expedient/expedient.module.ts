import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpedientController } from './expedient.controller';
import { ExpedientService } from './expedient.service';
import { Expedient } from '../entities/expedient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expedient])],
  controllers: [ExpedientController],
  providers: [ExpedientService],
  exports: [ExpedientService],
})
export class ExpedientModule {}
