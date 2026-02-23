import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDocumentSetDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUUID()
  @IsNotEmpty()
  expediente_id: string;
}

export class UpdateDocumentSetDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
