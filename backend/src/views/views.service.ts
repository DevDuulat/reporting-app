import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const view = this.viewsRepository.create({
      user: { id: data.user_id } as User,
      report: { id: data.report_id } as Report,
      type: data.type,
      timestamp: data.timestamp ?? new Date(),
    });

    return await this.viewsRepository.save(view);
  }
}
