import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WebsocketServiceModule } from './websocket-service.module';

const logger = new Logger('WEBSOCKET-SERVICE');

async function bootstrap() {
  const app = await NestFactory.create(WebsocketServiceModule, {
    logger: JSON.parse(process.env.DEBUG || 'false')
    ? ['error', 'warn', 'verbose', 'debug']
    : false,
  });

  const config = app.get(ConfigService);
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: config.get('msRedis'),
  })

  await app.startAllMicroservices();

  logger.warn(`Running at: 3011`);

  await app.listen(3011);
}
bootstrap();
