import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expedient } from '../entities/expedient.entity';
import { CreateExpedientDto, UpdateExpedientDto } from './dto/expedient.dto';

@Injectable()
export class ExpedientService {
  constructor(
    @InjectRepository(Expedient)
    private readonly expedientRepository: Repository<Expedient>,
  ) {}

  async create(createExpedientDto: CreateExpedientDto): Promise<Expedient> {
    const expedient = this.expedientRepository.create(createExpedientDto);
    return this.expedientRepository.save(expedient);
  }

  async findAll(): Promise<Expedient[]> {
    return this.expedientRepository.find({
      relations: ['document_sets', 'document_sets.files'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Expedient> {
    const expedient = await this.expedientRepository.findOne({
      where: { id },
      relations: ['document_sets', 'document_sets.files'],
    });

    if (!expedient) {
      throw new NotFoundException(`Expedient with id ${id} not found`);
    }

    return expedient;
  }

  async update(
    id: string,
    updateExpedientDto: UpdateExpedientDto,
  ): Promise<Expedient> {
    const expedient = await this.findById(id);
    Object.assign(expedient, updateExpedientDto);
    return this.expedientRepository.save(expedient);
  }

  async delete(id: string): Promise<{ message: string }> {
    const expedient = await this.findById(id);
    await this.expedientRepository.remove(expedient);
    return { message: `Expedient ${id} deleted successfully` };
  }
}
