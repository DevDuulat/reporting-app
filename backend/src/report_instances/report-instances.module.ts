import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportInstance } from './report-instance.entity';
import { ReportInstancesService } from './report-instances.service';
import { ReportInstancesController } from './report-instances.controller';
import { MinioService } from '../minio/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportInstance])],
  controllers: [ReportInstancesController],
  providers: [ReportInstancesService, MinioService],
})
export class ReportInstancesModule {}
