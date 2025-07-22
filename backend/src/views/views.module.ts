import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { View } from './view.entity';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';

@Module({
  imports: [TypeOrmModule.forFeature([View])],
  providers: [ViewsService],
  controllers: [ViewsController],
  exports: [ViewsService],
})
export class ViewsModule {}
