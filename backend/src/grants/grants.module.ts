// src/grants/grants.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrantsService } from './grants.service';
import { Grant } from '../grants/grant.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grant, User])],
  providers: [GrantsService],
  exports: [GrantsService],
})
export class GrantsModule {}
