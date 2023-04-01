import { MessageService } from '@domain/message/message.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReactionListener {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  async handle(user, message) {
    if ( !message.reaction ) return false;

    const reactedMessage = await this.messageService.findOne({
      whatsapp_id: message.reaction.message_id,
    });

    return true;
  }
}
