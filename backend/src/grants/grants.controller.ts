import { Controller, Get, Param, UnauthorizedException } from '@nestjs/common';
import { GrantsService } from './grants.service';

@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @Get(':accessToken')
  async getReportByGrant(@Param('accessToken') token: string) {
    const currentUserId = 6;

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

    return {
      reportInstance: grant.reportInstance,
      fileId: grant.reportInstance.minio_id,
    };
  }
}
