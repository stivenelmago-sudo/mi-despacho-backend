import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ExpedienteService } from './expediente.service';
import { CreateExpedienteDto, UpdateExpedienteDto } from './dto/expediente.dto';
import { Expediente } from '../entities/expediente.entity';

@Controller('expediente')
export class ExpedienteController {
  constructor(private readonly expedienteService: ExpedienteService) {}

  @Post()
  create(
    @Body() createExpedienteDto: CreateExpedienteDto,
  ): Promise<Expediente> {
    return this.expedienteService.create(createExpedienteDto);
  }

  @Get()
  findAll(): Promise<Expediente[]> {
    return this.expedienteService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Expediente> {
    return this.expedienteService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpedienteDto: UpdateExpedienteDto,
  ): Promise<Expediente> {
    return this.expedienteService.update(id, updateExpedienteDto);
  }

  @Delete(':id')
  @HttpCode(200)
  delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.expedienteService.delete(id);
  }
}
