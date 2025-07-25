// grants.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from './grant.entity';
import { User } from '../users/user.entity';
import { ReportInstance } from '../report_instances/report-instance.entity';
import { MoreThan } from 'typeorm';

@Injectable()
export class GrantsService {
  constructor(
    @InjectRepository(Grant)
    private readonly grantRepository: Repository<Grant>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByAccessToken(token: string): Promise<Grant | null> {
    const grant = await this.grantRepository.findOne({
      where: {
        accessToken: token,
      },
      relations: ['user', 'reportInstance', 'reportInstance.report'],
    });

    return grant;
  }

  async decrementTokenLimit(id: number): Promise<void> {
    await this.grantRepository.decrement({ id }, 'tokenLimit', 1);
  }

  async findInstancesByUser(
  userId: number,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;

  const [grants, total] = await this.grantRepository.findAndCount({
    where: { user: { id: userId } },
    relations: ['reportInstance', 'reportInstance.report', 'user'],
    skip,
    take: limit,
  });

  const reportInstances = grants.map((grant) => grant.reportInstance);

  Logger.log(`User ${userId} page ${page} limit ${limit} total ${total}`);
  Logger.debug(`ReportInstances: ${JSON.stringify(reportInstances, null, 2)}`);

  return {
    data: reportInstances,
    total,
    page,
    limit,
    hasMore: skip + reportInstances.length < total,
  };
}
}
