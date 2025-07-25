import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportInstancesService } from './report-instances.service';
import { CreateReportInstanceDto } from './dto/create-report-instance.dto';
import { UpdateReportInstanceDto } from './dto/update-report-instance.dto';
import { GrantsService } from '../grants/grants.service';

@Controller('report-instances')
export class ReportInstancesController {
  private readonly logger = new Logger(ReportInstancesController.name);

  constructor(
    private readonly service: ReportInstancesService,
    private readonly grantsService: GrantsService,
  ) {}

  @Post()
  create(@Body() dto: CreateReportInstanceDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll(
    @Query('userId') userId?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    page = +page;
    limit = +limit;

    if (userId) {
      return this.grantsService.findInstancesByUser(+userId, page, limit);
    }

    if (page && limit) {
      return this.service.findAllPaginated({
        page,
        limit,
        userId: userId ? +userId : undefined,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportInstanceDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post('/upload/:report_id')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('report_id') reportId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateReportInstanceDto,
  ) {
    return this.service.upload(reportId, file, body);
  }
}
