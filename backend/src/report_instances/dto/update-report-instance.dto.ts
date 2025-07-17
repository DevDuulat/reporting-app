import { PartialType } from '@nestjs/mapped-types';
import { CreateReportInstanceDto } from './create-report-instance.dto';

export class UpdateReportInstanceDto extends PartialType(
  CreateReportInstanceDto,
) {}
