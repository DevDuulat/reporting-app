import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { config } from '../minio-client/config';
import * as fs from 'fs';

@Injectable()
export class MinioService {
  private minioClient: Client;

  constructor() {
    this.minioClient = new Client({
      endPoint: config.MINIO_ENDPOINT,
      port: config.MINIO_PORT,
      useSSL: false,
      accessKey: config.MINIO_ACCESSKEY,
      secretKey: config.MINIO_SECRETKEY,
    });
  }

  async uploadTestFile(): Promise<string> {
    const filePath = 'src/assets/test.pdf';
    const fileStream = fs.createReadStream(filePath);
    const fileStat = fs.statSync(filePath);

    const bucket = config.MINIO_BUCKET;
    const objectName = 'test.pdf';

    const exists = await this.minioClient.bucketExists(bucket);
    if (!exists) {
      await this.minioClient.makeBucket(bucket, 'us-east-1');
    }

    await this.minioClient.putObject(
      bucket,
      objectName,
      fileStream,
      fileStat.size,
    );
    return `Файл '${objectName}' успешно загружен в бакет '${bucket}'`;
  }
}
