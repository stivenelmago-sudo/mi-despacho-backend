import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
  Body,
  BadRequestException,
  HttpCode,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { DocumentSet } from '../entities/document-set.entity';
import type { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/:expedienteId')
  @UseInterceptors(FilesInterceptor('files', 50, {}))
  async uploadFiles(
    @Param('expedienteId') expedienteId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { titulo: string; descripcion?: string },
  ): Promise<DocumentSet> {
    if (!body.titulo) {
      throw new BadRequestException('titulo is required');
    }

    return this.fileService.uploadFiles(
      expedienteId,
      body.titulo,
      body.descripcion || '',
      files,
    );
  }

  @Get('document-set/:documentSetId')
  async getDocumentSet(
    @Param('documentSetId') documentSetId: string,
  ): Promise<DocumentSet> {
    return this.fileService.getDocumentSet(documentSetId);
  }

  @Delete(':fileId')
  @HttpCode(200)
  async deleteFile(
    @Param('fileId') fileId: string,
  ): Promise<{ message: string }> {
    return this.fileService.deleteFile(fileId);
  }

  @Delete('document-set/:documentSetId')
  @HttpCode(200)
  async deleteDocumentSet(
    @Param('documentSetId') documentSetId: string,
  ): Promise<{ message: string }> {
    return this.fileService.deleteDocumentSet(documentSetId);
  }

  @Get('download/:fileId')
  async downloadFile(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.fileService.downloadFile(fileId, res);
  }
}
