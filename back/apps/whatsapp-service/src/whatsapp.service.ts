import { Injectable } from '@nestjs/common';
import { QuoteListener } from './listeners/quote.listener';
import { MessageListener } from './listeners/message.listener';
import { CommandListener } from './listeners/command.listener';
import { InlineCommandListener } from './listeners/inline-command.listener';
import { SenderService } from './services/sender.service';
import { MessageType } from './services/post-mapper.service';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly quoteListener: QuoteListener,
    private readonly commandListener: CommandListener,
    private readonly inlineCommandListener: InlineCommandListener,
    private readonly messageListener: MessageListener,
    private readonly senderService: SenderService,
  ) {}

  async listen(user, message) {
    if ( message.type === MessageType.REACTION ) return;

    if ( message.type !== MessageType.TEXT ) {
      this.senderService.textToUser(user.id, 'For now I can only schedule text messages');
      return;
    }

    if ( message.context ) {
      if ( message.text.body.startsWith('/') ) {
        return await this.inlineCommandListener.handle(user, message);
      }
      return await this.quoteListener.handle(user, message);
    }

    if ( message.text.body.startsWith('/') )
      return this.commandListener.handle(user, message);

    return await this.messageListener.handle(user, message);
  }
}
