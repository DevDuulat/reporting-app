import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { MinioService } from './minio.service';

@Controller('files') // или 'minio', как у тебя настроено
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get(':minioId')
  async getFile(@Param('minioId') minioId: string, @Res() res: Response) {
    try {
      const stream = await this.minioService.getFileStream(minioId);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${minioId}"`,
      });
      stream.pipe(res);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
