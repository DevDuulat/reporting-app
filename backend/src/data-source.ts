import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'duulat',
  password: process.env.DB_PASSWORD || 'TP7Ughn0GUIN1E',
  database: process.env.DB_DATABASE || 'report_db',
  entities: [join(__dirname, '**/*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/**/*.{ts,js}')],
  synchronize: false,
  migrationsRun: false,
});

export default AppDataSource;
