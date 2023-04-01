import { DomainModule } from '@domain';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@shared';
import { TransportModule } from '@transport/transport';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { ContactController } from './controllers/contact.controller';
import configuration from '../../../../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DomainModule,
    SharedModule,
    TransportModule,
  ],
  controllers: [
    UserController,
    AuthController,
    ContactController,
  ],
})
export class DashboardModule {}
