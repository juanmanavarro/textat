import { Injectable } from '@nestjs/common';
import { QuoteListener } from './listeners/quote.listener';
import { MessageListener } from './listeners/message.listener';
import { CommandListener } from './listeners/command.listener';
import { InlineCommandListener } from './listeners/inline-command.listener';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly quoteListener: QuoteListener,
    private readonly commandListener: CommandListener,
    private readonly inlineCommandListener: InlineCommandListener,
    private readonly messageListener: MessageListener,
  ) {}

  async listen(user, message) {
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
