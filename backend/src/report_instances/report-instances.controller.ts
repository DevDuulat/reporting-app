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
    this.logger.log('Creating report instance');
    return this.service.create(dto);
  }

  @Get()
  async findAllOrByUser(@Query('userId') userId?: number) {
    if (userId) {
      this.logger.log(`Getting report instances for userId=${userId}`);
      return this.grantsService.findInstancesByUser(userId);
    }

    this.logger.log('Getting all report instances');
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Getting report instance with id=${id}`);
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportInstanceDto) {
    this.logger.log(`Updating report instance with id=${id}`);
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing report instance with id=${id}`);
    return this.service.remove(+id);
  }

  @Post('/upload/:report_id')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('report_id') reportId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateReportInstanceDto,
  ) {
    this.logger.log(`Uploading file for report_id=${reportId}`);
    return this.service.upload(reportId, file, body);
  }
}
