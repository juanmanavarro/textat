import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TransportService } from './transport.service';
import { WsService } from './services/ws.service';

const logger = new Logger('TransportModule');

@Module({
  providers: [
    {
      provide: 'EVENT_EMITTER',
      useFactory: (configService: any) => {
        return ClientProxyFactory.create({
          transport: Transport.REDIS,
          options: configService.get('msRedis'),
        });
      },
      inject: [ConfigService],
    },
    TransportService,
    WsService,
  ],
  exports: [
    TransportService,
    WsService,
  ],
})
export class TransportModule {}
