import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { GrantsService } from '../grants/grants.service';
import { ReportInstancesService } from './report-instances.service';
import { ViewsService } from '../views/views.service';

@Controller('api')
export class ReportAccessController {
  constructor(
    private readonly grantsService: GrantsService,
    private readonly reportInstancesService: ReportInstancesService,
    private readonly viewsService: ViewsService,
  ) {}

  @Post('views')
  async recordView(
    @Body()
    { userId, reportInstanceId }: { userId: number; reportInstanceId: number },
  ) {
    const reportInstance =
      await this.reportInstancesService.findById(reportInstanceId);
    if (!reportInstance) {
      throw new NotFoundException('Report instance not found');
    }

    await this.viewsService.create({
      user_id: userId,
      report_id: reportInstance.report_id,
      type: 'view_report',
      timestamp: new Date(),
    });

    return { status: 'ok' };
  }
}
