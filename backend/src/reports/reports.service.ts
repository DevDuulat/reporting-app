import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.find();
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async create(dto: CreateReportDto): Promise<Report> {
    const report = this.reportsRepository.create(dto);
    return this.reportsRepository.save(report);
  }

  async update(id: number, dto: UpdateReportDto): Promise<Report> {
    await this.findOne(id);
    await this.reportsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const report = await this.findOne(id);
    await this.reportsRepository.remove(report);
  }
}
