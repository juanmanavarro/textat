import { CacheModule, Module } from '@nestjs/common';
import { WhatsappServiceController } from './whatsapp-service.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../config';
import { DomainModule } from '@domain';
import { TransportModule } from '@transport/transport';
import { SenderService } from './services/sender.service';
import { NotificationService } from './services/notification.service';
import { ParserService } from './services/parser.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderTask } from './tasks/reminder.task';
import { HelpCommand } from './commands/help.command';
import { HealthCheckController } from './health-check.controller';
import { QuoteListener } from './listeners/quote.listener';
import { CommandListener } from './listeners/command.listener';
import { WhatsappService } from './whatsapp.service';
import { WhatsappServiceSubscriber } from './whatsapp-service.subscriber';
import { SharedModule } from '@shared';
import { LocalizationModule } from "@squareboat/nestjs-localization";
import { TranslatorService } from './services/translator.service';
import { HelpMessage } from './messages/help.message';
import * as path from 'node:path';
import { LanguageCommand } from './commands/language.command';
import { ReminderPayloadService } from './services/reminder-payload.service';
import { MessageListener } from './listeners/message.listener';
import { InlineCommandListener } from './listeners/inline-command.listener';
import { RepeatCommand } from './commands/repeat.command';
import { StopCommand } from './commands/stop.command';

@Module({
  imports: [
    LocalizationModule.register({
      path: path.join(__dirname, '../../../locales'),
      fallbackLang: "en",
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CacheModule.register({ ttl: 300000 }),
    DomainModule,
    TransportModule,
    SharedModule,
  ],
  controllers: [
    HealthCheckController,
    WhatsappServiceController,
    WhatsappServiceSubscriber,
  ],
  providers: [
    // commands
    HelpCommand,
    LanguageCommand,
    RepeatCommand,
    StopCommand,
    // tasks
    ReminderTask,
    // services
    SenderService,
    NotificationService,
    ParserService,
    // listeners
    QuoteListener,
    CommandListener,
    InlineCommandListener,
    WhatsappService,
    //
    TranslatorService,
    HelpMessage,
    ReminderPayloadService,
    MessageListener,
  ],
})
export class WhatsappServiceModule {}
