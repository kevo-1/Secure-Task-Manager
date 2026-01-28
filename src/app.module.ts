import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    LogModule,
    TaskModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('*');
  }
}
