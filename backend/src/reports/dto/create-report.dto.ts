import { IsString, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  notif_rules?: string;
}
