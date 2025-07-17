import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './data-source';

import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { MinioModule } from './minio/minio.module';
import { ReportInstancesModule } from './report_instances/report-instances.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    ReportsModule,
    MinioModule,
    ReportInstancesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
