import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { View } from '../views/view.entity';
import { Report } from '../reports/report.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View)
    private readonly viewsRepository: Repository<View>,
  ) {}

  async create(data: {
    user_id: number;
    report_id: number;
    type: string;
    timestamp?: Date;
  }): Promise<View> {
    const oneSecondAgo = new Date(Date.now() - 1000);

    const existing = await this.viewsRepository.findOne({
      where: {
        user: { id: data.user_id },
        report: { id: data.report_id },
        type: data.type,
        timestamp: MoreThan(oneSecondAgo),
      },
    });

    if (existing) {
      return existing;
    }

    const view = this.viewsRepository.create({
      user: { id: data.user_id } as User,
      report: { id: data.report_id } as Report,
      type: data.type,
      timestamp: data.timestamp ?? new Date(),
    });

    return await this.viewsRepository.save(view);
  }

  async findByUserId(userId: number) {
    return this.viewsRepository.find({
      where: { user: { id: userId } },
      relations: ['report'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByUserIdPaginated(userId: number, page: number, limit: number) {
    const [result, total] = await this.viewsRepository.findAndCount({
      where: { user_id: userId },
      take: limit,
      skip: (page - 1) * limit,
      order: { timestamp: 'DESC' },
    });

    return {
      data: result,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
