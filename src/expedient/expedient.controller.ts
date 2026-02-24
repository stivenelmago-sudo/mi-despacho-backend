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
import { ExpedientService } from './expedient.service';
import { CreateExpedientDto, UpdateExpedientDto } from './dto/expedient.dto';
import { Expedient } from '../entities/expedient.entity';

@Controller('expedient')
export class ExpedientController {
  constructor(private readonly expedientService: ExpedientService) {}

  @Post()
  create(
    @Body() createExpedientDto: CreateExpedientDto,
  ): Promise<Expedient> {
    return this.expedientService.create(createExpedientDto);
  }

  @Get()
  findAll(): Promise<Expedient[]> {
    return this.expedientService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Expedient> {
    return this.expedientService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpedientDto: UpdateExpedientDto,
  ): Promise<Expedient> {
    return this.expedientService.update(id, updateExpedientDto);
  }

  @Delete(':id')
  @HttpCode(200)
  delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.expedientService.delete(id);
  }
}
