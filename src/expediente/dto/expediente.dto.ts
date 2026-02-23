import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateExpedienteDto {
  @IsString()
  @IsNotEmpty()
  numero_expediente: string;

  @IsString()
  @IsNotEmpty()
  cliente_nombre: string;

  @IsString()
  @IsOptional()
  abogado_asignado?: string;

  @IsEnum(['Activo', 'Cerrado', 'En Revisión', 'Suspendido'])
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  @IsOptional()
  fecha_apertura?: string;

  @IsDateString()
  @IsOptional()
  fecha_cierre?: string;
}

export class UpdateExpedienteDto {
  @IsString()
  @IsOptional()
  numero_expediente?: string;

  @IsString()
  @IsOptional()
  cliente_nombre?: string;

  @IsString()
  @IsOptional()
  abogado_asignado?: string;

  @IsEnum(['Activo', 'Cerrado', 'En Revisión', 'Suspendido'])
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  @IsOptional()
  fecha_apertura?: string;

  @IsDateString()
  @IsOptional()
  fecha_cierre?: string;
}
