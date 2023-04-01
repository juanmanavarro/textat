import { DomainModule } from '@domain';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule } from '@shared';
import configuration from '../../../config';
import { AuthController } from './controllers/auth.controller';
import { HealthCheckController } from './controllers/health-check.controller';
import { TransportModule } from '@transport/transport';
import { PostController } from './controllers/post.controller';
import { CategoryController } from './controllers/category.controller';
import { TagController } from './controllers/tag.controller';
import { SubscriptionModule } from './subscription/subscription.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DomainModule,
    SharedModule,
    TransportModule,
    SubscriptionModule,
    DashboardModule,
  ],
  controllers: [
    AuthController,
    PostController,
    HealthCheckController,
    CategoryController,
    TagController,
  ],
})
export class AppModule {}
