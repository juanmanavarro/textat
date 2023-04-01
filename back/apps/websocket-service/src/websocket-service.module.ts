import { DomainModule } from '@domain';
import { Module } from '@nestjs/common';
import { WebsocketServiceSubscriber } from './websocket-service.subscriber';
import { WebsocketServiceGateway } from './websocket-service.gateway';
import { WebsocketServiceService } from './websocket-service.service';
import { TransportModule } from '@transport/transport';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../config';
import { HealthCheckController } from './health-check.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DomainModule,
    TransportModule,
  ],
  controllers: [
    WebsocketServiceSubscriber,
    HealthCheckController,
  ],
  providers: [
    WebsocketServiceGateway,
    WebsocketServiceService,
  ],
})
export class WebsocketServiceModule {}
