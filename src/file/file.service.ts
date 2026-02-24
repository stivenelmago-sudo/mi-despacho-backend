import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { DocumentSet } from '../entities/document-set.entity';
import { Expedient } from '../entities/expedient.entity';
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
    @InjectRepository(Expedient)
    private readonly expedientRepository: Repository<Expedient>,
  ) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async createDocumentSet(
    createDocumentSetDto: CreateDocumentSetDto,
  ): Promise<DocumentSet> {
    // Verify that the expedient exists
    const expedient = await this.expedientRepository.findOne({
      where: { id: createDocumentSetDto.expedient_id },
    });

    if (!expedient) {
      throw new NotFoundException(
        `Expedient with id ${createDocumentSetDto.expedient_id} not found`,
      );
    }

    const documentSet = this.documentSetRepository.create(createDocumentSetDto);
    return this.documentSetRepository.save(documentSet);
  }

  async uploadFiles(
    expedientId: string,
    title: string,
    description: string,
    files: Express.Multer.File[],
  ): Promise<DocumentSet> {
    // Verify that the expedient exists
    const expedient = await this.expedientRepository.findOne({
      where: { id: expedientId },
    });

    if (!expedient) {
      throw new NotFoundException(
        `Expedient with id ${expedientId} not found`,
      );
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    // Create document set
    const documentSet = await this.createDocumentSet({
      expedient_id: expedientId,
      title,
      description,
    });

    // Save files
    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(this.uploadDir, fileName);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Save record to database
      const newFile = this.fileRepository.create({
        original_name: file.originalname,
        file_name: fileName,
        file_path: filePath,
        mimetype: file.mimetype,
        size_bytes: file.size,
        document_set_id: documentSet.id,
      });

      await this.fileRepository.save(newFile);
    }

    // Return document set with files
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

    // Delete file from disk
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    // Delete record from database
    await this.fileRepository.remove(file);

    return { message: `File ${fileId} deleted successfully` };
  }

  async deleteDocumentSet(documentSetId: string): Promise<{ message: string }> {
    const documentSet = await this.getDocumentSet(documentSetId);

    // Delete all files from disk
    for (const file of documentSet.files) {
      if (fs.existsSync(file.file_path)) {
        fs.unlinkSync(file.file_path);
      }
    }

    // Delete document set (cascade deletes files from database)
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

    if (!fs.existsSync(file.file_path)) {
      throw new NotFoundException('File not found on disk');
    }

    const fileBuffer = fs.readFileSync(file.file_path);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.original_name}"`,
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
