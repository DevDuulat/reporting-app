import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportInstance } from './report-instance.entity';
import { ReportUser } from '../reports/report-user.entity';
import { Grant } from '../grants/grant.entity';
import { ReportInstancesService } from './report-instances.service';
import { ReportInstancesController } from './report-instances.controller';
import { MinioService } from '../minio/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportInstance, ReportUser, Grant])],
  controllers: [ReportInstancesController],
  providers: [ReportInstancesService, MinioService],
})
export class ReportInstancesModule {}
