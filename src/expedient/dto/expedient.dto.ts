import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateExpedientDto {
  @IsString()
  @IsNotEmpty()
  case_number: string;

  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsString()
  @IsOptional()
  assigned_lawyer?: string;

  @IsEnum(['Active', 'Closed', 'In Review', 'Suspended'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  opening_date?: string;

  @IsDateString()
  @IsOptional()
  closing_date?: string;
}

export class UpdateExpedientDto {
  @IsString()
  @IsOptional()
  case_number?: string;

  @IsString()
  @IsOptional()
  client_name?: string;

  @IsString()
  @IsOptional()
  assigned_lawyer?: string;

  @IsEnum(['Active', 'Closed', 'In Review', 'Suspended'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  opening_date?: string;

  @IsDateString()
  @IsOptional()
  closing_date?: string;
}
