import { Controller, Get } from '@nestjs/common';
import { Connection } from 'typeorm';

@Controller()
export class AppController {
  constructor(private connection: Connection) {}

  @Get('test-db')
  async testConnection() {
    try {
      await this.connection.query('SELECT 1');
      return { status: 'Database connection successful!' };
    } catch (error) {
      return {
        status: 'Database connection failed',
        error: error.message,
      };
    }
  }
}
