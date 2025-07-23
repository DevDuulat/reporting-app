import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ViewsService } from './views.service';

@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Post()
  async createView(
    @Body() body: { user_id: number; report_id: number; type: string },
  ) {
    return this.viewsService.create(body);
  }

  @Get('by-user/:userId')
  async getViewsByUser(
    @Param('userId') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const pageNumber = Number(page);
    const limitNumber = Math.min(Number(limit), 10);

    return this.viewsService.findByUserIdPaginated(
      userId,
      pageNumber,
      limitNumber,
    );
  }
}
