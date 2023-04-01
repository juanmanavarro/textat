import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import { DateService } from '@shared/services/date.service';
const { MongoDB } = require('winston-mongodb');

@Injectable()
export class LogsService {
  private logger;
  private stripeLogger;
  private messageLogger;

  constructor() {
    const config = {
      db: process.env.MONGO_LOGS_URL,
      capped: true,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // auth: {
        //   user: loggerDBConfig.username,
        //   password: loggerDBConfig.password,
        // },
      },
      format: winston.format.combine(
        winston.format.metadata(),
      ),
    };
    this.logger = winston.createLogger({
      transports: [
        new MongoDB({
          ...config,
          level: 'warn',
          collection: 'logs',
        }),
      ]
    });
    this.stripeLogger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.printf(function(info) {
            const date = DateService.toFormat(undefined, 'DD/MM/YYYY HH:mm');
            return [
              `[${date}] ${info.level.toUpperCase()}:`,
              `${info.message}`
            ].join(' ');
          }),
        }),
        new MongoDB({
          ...config,
          level: 'info',
          collection: 'stripe_logs',
        }),
      ]
    });

    this.messageLogger = winston.createLogger({
      transports: [
        new MongoDB({
          ...config,
          level: 'info',
          collection: 'message_logs',
        }),
      ]
    });
  }

  log(message, metadata, level = 'warn') {
    this.logger.log(level, message, metadata);
  }

  stripe(message, metadata, level = 'info') {
    this.stripeLogger.log(level, message, metadata);
  }

  message(message, metadata, level = 'info') {
    this.messageLogger.log(level, message, metadata);
  }
}
