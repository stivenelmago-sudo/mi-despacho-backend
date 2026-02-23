import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { DocumentSet } from '../entities/document-set.entity';
import { Expediente } from '../entities/expediente.entity';
import { CreateDocumentSetDto } from './dto/document-set.dto';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class FileService {
  private readonly uploadDir = process.env.FILE_UPLOAD_DIR || './uploads';

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(DocumentSet)
    private readonly documentSetRepository: Repository<DocumentSet>,
    @InjectRepository(Expediente)
    private readonly expedienteRepository: Repository<Expediente>,
  ) {
    // Asegurar que el directorio de carga existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async createDocumentSet(
    createDocumentSetDto: CreateDocumentSetDto,
  ): Promise<DocumentSet> {
    // Verificar que el expediente existe
    const expediente = await this.expedienteRepository.findOne({
      where: { id: createDocumentSetDto.expediente_id },
    });

    if (!expediente) {
      throw new NotFoundException(
        `Expediente with id ${createDocumentSetDto.expediente_id} not found`,
      );
    }

    const documentSet = this.documentSetRepository.create(createDocumentSetDto);
    return this.documentSetRepository.save(documentSet);
  }

  async uploadFiles(
    expedienteId: string,
    titulo: string,
    descripcion: string,
    files: Express.Multer.File[],
  ): Promise<DocumentSet> {
    // Verificar que el expediente existe
    const expediente = await this.expedienteRepository.findOne({
      where: { id: expedienteId },
    });

    if (!expediente) {
      throw new NotFoundException(
        `Expediente with id ${expedienteId} not found`,
      );
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    // Crear document set
    const documentSet = await this.createDocumentSet({
      expediente_id: expedienteId,
      titulo,
      descripcion,
    });

    // Guardar archivos
    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(this.uploadDir, fileName);

      // Escribir archivo en disco
      fs.writeFileSync(filePath, file.buffer);

      // Guardar registro en BD
      const newFile = this.fileRepository.create({
        nombre_original: file.originalname,
        nombre_archivo: fileName,
        path_archivo: filePath,
        mimetype: file.mimetype,
        tamanio_bytes: file.size,
        document_set_id: documentSet.id,
      });

      await this.fileRepository.save(newFile);
    }

    // Retornar documento set con archivos
    const savedDocumentSet = await this.documentSetRepository.findOne({
      where: { id: documentSet.id },
      relations: ['files'],
    });

    if (!savedDocumentSet) {
      throw new NotFoundException(
        `DocumentSet with id ${documentSet.id} not found`,
      );
    }

    return savedDocumentSet;
  }

  async getDocumentSet(documentSetId: string): Promise<DocumentSet> {
    const documentSet = await this.documentSetRepository.findOne({
      where: { id: documentSetId },
      relations: ['files'],
    });

    if (!documentSet) {
      throw new NotFoundException(
        `DocumentSet with id ${documentSetId} not found`,
      );
    }

    return documentSet;
  }

  async deleteFile(fileId: string): Promise<{ message: string }> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException(`File with id ${fileId} not found`);
    }

    // Eliminar archivo del disco
    if (fs.existsSync(file.path_archivo)) {
      fs.unlinkSync(file.path_archivo);
    }

    // Eliminar registro de BD
    await this.fileRepository.remove(file);

    return { message: `File ${fileId} deleted successfully` };
  }

  async deleteDocumentSet(documentSetId: string): Promise<{ message: string }> {
    const documentSet = await this.getDocumentSet(documentSetId);

    // Eliminar todos los archivos del disco
    for (const file of documentSet.files) {
      if (fs.existsSync(file.path_archivo)) {
        fs.unlinkSync(file.path_archivo);
      }
    }

    // Eliminar documento set (cascade elimina archivos de BD)
    await this.documentSetRepository.remove(documentSet);

    return { message: `DocumentSet ${documentSetId} deleted successfully` };
  }

  async downloadFile(fileId: string, res: any): Promise<void> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException(`File with id ${fileId} not found`);
    }

    if (!fs.existsSync(file.path_archivo)) {
      throw new NotFoundException('File not found on disk');
    }

    const fileBuffer = fs.readFileSync(file.path_archivo);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.nombre_original}"`,
      'Content-Length': fileBuffer.length,
    });

    res.send(fileBuffer);
  }

  async getFileByPath(filePath: string): Promise<Buffer> {
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return fs.readFileSync(filePath);
  }
}
