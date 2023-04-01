import { CacheModule, Module } from '@nestjs/common';
import { WhatsappServiceController } from './whatsapp-service.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../config';
import { DomainModule } from '@domain';
import { RegisterConversation } from './conversations/register.conversation';
import { PostMapperService } from './services/post-mapper.service';
import { TransportModule } from '@transport/transport';
import { SenderService } from './services/sender.service';
import { NotificationService } from './services/notification.service';
import { ParserService } from './services/parser.service';
import { MediaService } from './services/media.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderTask } from './tasks/reminder.task';
import { UrlService } from './services/url.service';
import { HelpCommand } from './commands/help.command';
import { HealthCheckController } from './health-check.controller';
import { PostListener } from './listeners/post.listener';
import { QuoteListener } from './listeners/quote.listener';
import { CommandListener } from './listeners/command.listener';
import { ConversationListener } from './listeners/conversation.listener';
import { ReactionListener } from './listeners/reaction.listener';
import { WhatsappService } from './whatsapp.service';
import { PocketCommand } from './commands/pocket.command';
import { ChangePasswordConversation } from './conversations/change-password.conversation';
import { WhatsappServiceSubscriber } from './whatsapp-service.subscriber';
import { RecoverPasswordConversation } from './conversations/recover-password.conversation';
import { CommanderService } from './services/commander.service';
import { SharedModule } from '@shared';
import { TrialTask } from './tasks/trial.task';
import { ReminderHandler } from './handlers/reminder.handler';
import { ContactCommand } from './commands/contact.command';
import { LocalizationModule } from "@squareboat/nestjs-localization";
import { TranslatorService } from './services/translator.service';
import { HelpMessage } from './messages/help.message';
import * as path from 'node:path';
import { LanguageCommand } from './commands/language.command';

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
    // conversation
    RegisterConversation,
    ChangePasswordConversation,
    RecoverPasswordConversation,
    // commands
    HelpCommand,
    PocketCommand,
    ContactCommand,
    LanguageCommand,
    // tasks
    ReminderTask,
    TrialTask,
    // services
    PostMapperService,
    SenderService,
    NotificationService,
    ParserService,
    MediaService,
    UrlService,
    // listeners
    PostListener,
    QuoteListener,
    CommandListener,
    ConversationListener,
    ReactionListener,
    WhatsappService,
    CommanderService,
    // handlers
    ReminderHandler,
    TranslatorService,
    HelpMessage,
  ],
})
export class WhatsappServiceModule {}
