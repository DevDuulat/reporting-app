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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportInstancesService } from './report-instances.service';
import { CreateReportInstanceDto } from './dto/create-report-instance.dto';
import { UpdateReportInstanceDto } from './dto/update-report-instance.dto';

@Controller('report-instances')
export class ReportInstancesController {
  constructor(private readonly service: ReportInstancesService) {}

  @Post()
  create(@Body() dto: CreateReportInstanceDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
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
