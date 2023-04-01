import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WhatsappServiceModule } from './whatsapp-service.module';

async function bootstrap() {
  const app = await NestFactory.create(WhatsappServiceModule, {
    logger: JSON.parse(process.env.DEBUG || 'false')
      ? ['error', 'warn', 'verbose', 'debug']
      : ['warn'],
  });

  const config = app.get(ConfigService);
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: config.get('msRedis'),
  });
  await app.startAllMicroservices();

  await app.listen(3003);
}
bootstrap();
