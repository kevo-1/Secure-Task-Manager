import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { LogModule } from '../log/log.module';

@Module({
  imports: [PrismaModule, LogModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
