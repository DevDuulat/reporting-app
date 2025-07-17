import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './report.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Report> {
    return this.reportsService.findOne(+id);
  }

  @Post()
  async create(@Body() dto: CreateReportDto): Promise<Report> {
    return this.reportsService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
  ): Promise<Report> {
    return this.reportsService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(+id);
  }
}
