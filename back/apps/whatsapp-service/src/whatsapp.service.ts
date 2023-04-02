import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CommandListener } from './listeners/command.listener';
import { PostListener } from './listeners/post.listener';
import { QuoteListener } from './listeners/quote.listener';
import { ParserService } from './services/parser.service';
import { Cache } from 'cache-manager';
import { MessageFrom } from './whastapp-service.constants';
import { MessageListener } from './listeners/message.listener';

const commands = {
  '/contraseña': 'changePasswordConversation',
  '/password': 'changePasswordConversation',
};

const privateCommands = {
  '/recover': 'recoverPasswordConversation',
};

@Injectable()
export class WhatsappService {
  constructor(
    private readonly quoteListener: QuoteListener,
    private readonly commandListener: CommandListener,
    private readonly messageListener: MessageListener,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async listen(user, message) {
    const { command, rest } = ParserService.command(message);
    if ( command ) {
      if ( commands[command] ) {
        await this.cacheManager.set(user.whatsapp_id, commands[command]);
      } else if ( privateCommands[command] && message.from === MessageFrom.APP ) {
        await this.cacheManager.set(user.whatsapp_id, privateCommands[command]);
      } else {
        return await this.commandListener.handle(user, command, rest);
      }
    }

    if ( message.context ) return await this.quoteListener.handle(user, message);

    return await this.messageListener.handle(user, message);
  }
}
