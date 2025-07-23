import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grant } from '../grants/grant.entity';
import { TokenLimitTaskService } from './token-limit-task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grant])],
  providers: [TokenLimitTaskService],
})
export class TasksModule {}
