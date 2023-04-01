import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '@shared';
import { TransportModule } from '@transport/transport';
import { Subscription } from 'rxjs';
import { StripeService } from './services/stripe.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { StripeController } from './controllers/stripe.controller';
import { SubscriptionService } from './services/subscription.service';
import { TrialService } from './services/trial.service';
import { DomainModule } from '@domain';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionTask } from './tasks/subscription.task';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TransportModule,
    SharedModule,
    DomainModule,
  ],
  controllers: [SubscriptionController, StripeController],
  providers: [
    StripeService,
    SubscriptionService,
    TrialService,
    // tasks
    SubscriptionTask,
  ],
})
export class SubscriptionModule {}
