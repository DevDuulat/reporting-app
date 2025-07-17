import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ReportInstancesService } from './report-instances.service';
import { CreateReportInstanceDto } from './dto/create-report-instance.dto';
import { UpdateReportInstanceDto } from './dto/update-report-instance.dto';

@Controller('report-instances')
export class ReportInstancesController {
  constructor(private readonly service: ReportInstancesService) {}

  @Post()
  create(@Body() dto: CreateReportInstanceDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportInstanceDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
