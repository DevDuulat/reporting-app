// create-report-instance.dto.ts
import {
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportInstanceDto {
  @IsInt()
  @Type(() => Number)
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
}
