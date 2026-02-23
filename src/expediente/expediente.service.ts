import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expediente } from '../entities/expediente.entity';
import { CreateExpedienteDto, UpdateExpedienteDto } from './dto/expediente.dto';

@Injectable()
export class ExpedienteService {
  constructor(
    @InjectRepository(Expediente)
    private readonly expedienteRepository: Repository<Expediente>,
  ) {}

  async create(createExpedienteDto: CreateExpedienteDto): Promise<Expediente> {
    const expediente = this.expedienteRepository.create(createExpedienteDto);
    return this.expedienteRepository.save(expediente);
  }

  async findAll(): Promise<Expediente[]> {
    return this.expedienteRepository.find({
      relations: ['document_sets', 'document_sets.files'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Expediente> {
    const expediente = await this.expedienteRepository.findOne({
      where: { id },
      relations: ['document_sets', 'document_sets.files'],
    });

    if (!expediente) {
      throw new NotFoundException(`Expediente with id ${id} not found`);
    }

    return expediente;
  }

  async update(
    id: string,
    updateExpedienteDto: UpdateExpedienteDto,
  ): Promise<Expediente> {
    const expediente = await this.findById(id);
    Object.assign(expediente, updateExpedienteDto);
    return this.expedienteRepository.save(expediente);
  }

  async delete(id: string): Promise<{ message: string }> {
    const expediente = await this.findById(id);
    await this.expedienteRepository.remove(expediente);
    return { message: `Expediente ${id} deleted successfully` };
  }
}
