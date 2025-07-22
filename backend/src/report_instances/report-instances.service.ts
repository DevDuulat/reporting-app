// report-instances.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportInstance } from './report-instance.entity';
import { CreateReportInstanceDto } from './dto/create-report-instance.dto';
import { UpdateReportInstanceDto } from './dto/update-report-instance.dto';
import { MinioService } from '../minio/minio.service';
import { ReportUser } from '../reports/report-user.entity';
import { Grant } from '../grants/grant.entity';
import { generateAccessToken } from '../common/utils/token';
import { In } from 'typeorm';

@Injectable()
export class ReportInstancesService {
  private readonly logger = new Logger(ReportInstancesService.name);
  constructor(
    @InjectRepository(ReportInstance)
    private repo: Repository<ReportInstance>,
    private readonly minioService: MinioService,

    @InjectRepository(ReportUser)
    private readonly reportUserRepo: Repository<ReportUser>,

    @InjectRepository(Grant)
    private readonly grantRepo: Repository<Grant>,
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
  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async findByIds(ids: number[]) {
    return this.repo.findBy({ id: In(ids) });
  }

  async upload(
    reportId: number,
    file: Express.Multer.File,
    body: CreateReportInstanceDto,
  ) {
    try {
      const minioObjectName = `${Date.now()}_${file.originalname}`;

      await this.minioService.uploadBuffer(file.buffer, minioObjectName);

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

      const savedInstance = await this.repo.save(instance);

      const reportUsers = await this.reportUserRepo.find({
        where: { report_id: reportId },
      });

      const grants = reportUsers.map((ru) =>
        this.grantRepo.create({
          reportInstance: { id: savedInstance.id },
          user: { id: ru.user_id },
          tokenLimit: 0,
          accessToken: generateAccessToken(),
        }),
      );

      await this.grantRepo.save(grants);

      this.logger.log(
        `Создано ${grants.length} грантов для отчета ${savedInstance.id}`,
      );

      return savedInstance;
    } catch (error) {
      console.error('Ошибка при загрузке отчета:', error);
      throw new Error('Не удалось загрузить отчет');
    }
  }
}
