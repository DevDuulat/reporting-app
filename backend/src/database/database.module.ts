import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'duulat',
      password: 'TP7Ughn0GUIN1E',
      database: 'report_db',
      entities: [join(__dirname, '**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, 'migrations/**/*{.ts,.js}')],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class DatabaseModule {}
