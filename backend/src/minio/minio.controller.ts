import { Controller, Get } from '@nestjs/common';
import { MinioService } from './minio.service';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get('upload-test')
  async uploadTestFile(): Promise<string> {
    return this.minioService.uploadTestFile();
  }
}
