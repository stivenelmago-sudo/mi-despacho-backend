import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDocumentSetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  expedient_id: string;
}

export class UpdateDocumentSetDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
