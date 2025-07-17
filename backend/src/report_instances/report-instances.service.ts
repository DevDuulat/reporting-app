import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportInstance } from './report-instance.entity';
import { CreateReportInstanceDto } from './dto/create-report-instance.dto';
import { UpdateReportInstanceDto } from './dto/update-report-instance.dto';

@Injectable()
export class ReportInstancesService {
  constructor(
    @InjectRepository(ReportInstance)
    private repo: Repository<ReportInstance>,
  ) {}

  create(dto: CreateReportInstanceDto) {
    const instance = this.repo.create(dto);
    return this.repo.save(instance);
  }

  findAll() {
    return this.repo.find({ relations: ['report'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['report'] });
  }

  update(id: number, dto: UpdateReportInstanceDto) {
    return this.repo.update(id, dto);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
