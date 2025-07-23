// tasks/token-limit-task.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from '../grants/grant.entity';

@Injectable()
export class TokenLimitTaskService {
  private readonly logger = new Logger(TokenLimitTaskService.name);

  constructor(
    @InjectRepository(Grant)
    private grantRepository: Repository<Grant>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleTokenLimitDecrement() {
    this.logger.log('Уменьшение token_limit начато...');

    await this.grantRepository
      .createQueryBuilder('grant')
      .update()
      .set({
        tokenLimit: () => 'GREATEST(token_limit - 1, 0)',
      })
      .execute();
    this.logger.log('Уменьшение token_limit завершено.');
  }
}
