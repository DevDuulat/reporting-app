import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportUser } from './report-user.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,

    @InjectRepository(ReportUser)
    private reportUsersRepository: Repository<ReportUser>,
  ) {}

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.find();
  }

  async findAllPaginated(page: number, limit: number) {
    const [data, total] = await this.reportsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
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

  async getUsersForReport(reportId: number): Promise<User[]> {
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['users'],
    });
    if (!report) throw new NotFoundException('Report not found');
    return report.users;
  }

  async setUsersForReport(reportId: number, userIds: number[]) {
    await this.reportUsersRepository.delete({ report_id: reportId });

    if (userIds.length === 0) return;

    const inserts = userIds.map((user_id) => ({
      report_id: reportId,
      user_id,
    }));
    await this.reportUsersRepository.save(inserts);
  }
}
