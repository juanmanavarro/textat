import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CommandListener } from './listeners/command.listener';
import { ConversationListener } from './listeners/conversation.listener';
import { PostListener } from './listeners/post.listener';
import { QuoteListener } from './listeners/quote.listener';
import { ReactionListener } from './listeners/reaction.listener';
import { ParserService } from './services/parser.service';
import { Cache } from 'cache-manager';
import { MessageFrom } from './whastapp-service.constants';

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
    private readonly conversationListener: ConversationListener,
    private readonly quoteListener: QuoteListener,
    private readonly commandListener: CommandListener,
    private readonly postListener: PostListener,
    private readonly reactionListener: ReactionListener,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async listen(user, message) {
    if ( !user.password ) {
      return await this.conversationListener
        .setConversation('registerConversation')
        .handle(user, message);
    }

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

    const currentConversation = await this.cacheManager.get(user.whatsapp_id);
    if ( currentConversation ) {
      return await this.conversationListener
        .setConversation(currentConversation)
        .handle(user, message);
    }

    if ( message.reaction ) return await this.reactionListener.handle(user, message);
    if ( message.context ) return await this.quoteListener.handle(user, message);

    return await this.postListener.handle(user, message);
  }
}
