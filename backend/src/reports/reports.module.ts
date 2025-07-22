import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

import { Report } from './report.entity';
import { ReportUser } from './report-user.entity';
import { View } from '../views/view.entity';

import { ViewsService } from '../views/views.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, ReportUser, View])],
  controllers: [ReportsController],
  providers: [ReportsService, ViewsService],
  exports: [ViewsService],
})
export class ReportsModule {}
