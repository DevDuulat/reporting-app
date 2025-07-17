// report-instances.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportInstance } from './report-instance.entity';
import { CreateReportInstanceDto } from './dto/create-report-instance.dto';
import { UpdateReportInstanceDto } from './dto/update-report-instance.dto';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class ReportInstancesService {
  private readonly logger = new Logger(ReportInstancesService.name);
  constructor(
    @InjectRepository(ReportInstance)
    private repo: Repository<ReportInstance>,
    private readonly minioService: MinioService,
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

  async upload(
    reportId: number,
    file: Express.Multer.File,
    body: CreateReportInstanceDto,
  ) {
    try {
      const minioObjectName = `${Date.now()}_${file.originalname}`;

      await this.minioService.uploadBuffer(file.buffer, minioObjectName);

      // Преобразуем tags в массив, если это строка
      let tags = body.tags;
      if (typeof tags === 'string') {
        try {
          tags = JSON.parse(tags);
        } catch (e) {
          throw new Error('Поле tags должно быть валидным JSON массивом');
        }
      }

      const instance = this.repo.create({
        report_id: reportId,
        title: body.title,
        summary: body.summary,
        day: body.day,
        tags,
        minio_id: minioObjectName,
      });

      return await this.repo.save(instance);
    } catch (error) {
      console.error('Ошибка при загрузке отчета:', error);
      throw new Error('Не удалось загрузить отчет');
    }
  }
}
