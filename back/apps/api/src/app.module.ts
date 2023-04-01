import { DomainModule } from '@domain';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule } from '@shared';
import configuration from '../../../config';
import { TransportModule } from '@transport/transport';

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
  ],
})
export class AppModule {}
