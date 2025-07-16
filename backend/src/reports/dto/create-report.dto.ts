import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsDateString()
  day: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  minio_id?: string;
}
