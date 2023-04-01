import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('API');

  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: JSON.parse(process.env.DEBUG || 'false')
      ? ['error', 'warn', 'verbose', 'debug']
      : false,
    bodyParser: false,
  });

  const config = app.get(ConfigService);
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: config.get('msRedis'),
  });

  await app.startAllMicroservices();

  const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
  };

  app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  logger.log(`Running at: ${process.env.APP_PORT}`);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
