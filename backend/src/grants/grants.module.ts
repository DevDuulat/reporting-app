import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrantsService } from './grants.service';
import { Grant } from './grant.entity';
import { User } from '../users/user.entity';
import { GrantsController } from './grants.controller';
import { ViewsModule } from '../views/views.module';

@Module({
  imports: [TypeOrmModule.forFeature([Grant, User]), ViewsModule],
  providers: [GrantsService],
  controllers: [GrantsController],
  exports: [GrantsService],
})
export class GrantsModule {}
