import {
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateReportInstanceDto {
  @IsInt()
  report_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsDateString()
  day: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  minio_id?: string;
}
