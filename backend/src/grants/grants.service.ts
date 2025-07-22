// grants.service.ts
import { Injectable } from '@nestjs/common';
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
    return this.grantRepository.findOne({
      where: { accessToken: token },
      relations: ['user', 'reportInstance'],
    });
  }

  async decrementTokenLimit(id: number): Promise<void> {
    await this.grantRepository.decrement({ id }, 'tokenLimit', 1);
  }

  async findInstancesByUser(userId: number): Promise<ReportInstance[]> {
    const grants = await this.grantRepository.find({
      where: {
        user: { id: userId },
        tokenLimit: MoreThan(0),
      },
      relations: ['reportInstance', 'reportInstance.report', 'user'],
    });

    return grants.map((grant) => grant.reportInstance);
  }
}
