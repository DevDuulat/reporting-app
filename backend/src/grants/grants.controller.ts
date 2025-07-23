import { Controller, Get, Param, UnauthorizedException } from '@nestjs/common';
import { GrantsService } from './grants.service';
import { ViewsService } from '../views/views.service';

@Controller('grants')
export class GrantsController {
  constructor(
    private readonly grantsService: GrantsService,
    private readonly viewsService: ViewsService,
  ) {}

  @Get(':accessToken')
  async getReportByGrant(@Param('accessToken') token: string) {
    const currentUserId = 1100;

    const grant = await this.grantsService.findByAccessToken(
      token,
      currentUserId,
    );

    if (!grant) {
      throw new UnauthorizedException(
        'Токен не найден или не принадлежит пользователю',
      );
    }

    if (grant.tokenLimit <= 0) {
      throw new UnauthorizedException('Токен исчерпан');
    }

    await this.viewsService.create({
      user_id: currentUserId,
      report_id: grant.reportInstance.report.id,
      type: 'token',
    });

    return {
      reportInstance: grant.reportInstance,
      fileId: grant.reportInstance.minio_id,
    };
  }
}
