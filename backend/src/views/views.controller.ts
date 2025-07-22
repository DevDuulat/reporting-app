import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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
  async getViewsByUser(@Param('userId') userId: number) {
    return this.viewsService.findByUserId(Number(userId));
  }
}
