import { DomainModule } from '@domain';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from 'apps/api/src/app.module';
import configuration from '../../../config';
import { AdminRegisterCommand } from './commands/admin-register';
import { TransportModule } from '@transport/transport';
import { ReceiveMessageCommand } from './commands/receive-message.command';
import { TimezoneCommand } from './commands/timezone';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TransportModule,
    DomainModule,
    AppModule,
  ],
  providers: [
    AdminRegisterCommand,
    ReceiveMessageCommand,
    TimezoneCommand,
  ],
})
export class CliModule {}
