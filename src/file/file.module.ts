import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from '../entities/file.entity';
import { DocumentSet } from '../entities/document-set.entity';
import { Expedient } from '../entities/expedient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File, DocumentSet, Expedient])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
