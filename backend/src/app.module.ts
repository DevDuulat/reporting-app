import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './data-source';

import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { MinioModule } from './minio/minio.module';
import { ReportInstancesModule } from './report_instances/report-instances.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ViewsModule } from './views/views.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    ReportsModule,
    MinioModule,
    ReportInstancesModule,
    ViewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
