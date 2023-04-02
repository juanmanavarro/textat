import { Injectable } from '@nestjs/common';
import { QuoteListener } from './listeners/quote.listener';
import { MessageListener } from './listeners/message.listener';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly quoteListener: QuoteListener,
    private readonly messageListener: MessageListener,
  ) {}

  async listen(user, message) {
    if ( message.context ) return await this.quoteListener.handle(user, message);

    return await this.messageListener.handle(user, message);
  }
}
