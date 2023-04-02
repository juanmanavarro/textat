import { MessageService } from '@domain/message/message.service';
import { Injectable } from '@nestjs/common';
import { ParserService } from '../services/parser.service';
import { DateService } from '@shared/services/date.service';
import { MessageType } from 'apps/whatsapp-service/src/services/post-mapper.service';
import { SenderService } from '../services/sender.service';

@Injectable()
export class MessageListener {
  constructor(
    private readonly messageService: MessageService,
    private readonly parserService: ParserService,
    private readonly senderService: SenderService,
  ) {}

  async handle(user, message) {
    if ( message.type !== MessageType.TEXT ) {
      this.senderService.textToUser(user.id, 'For now I can only schedule text messages');
      return;
    }

    const { temp, rest } = await this.parserService.parse(message.text.body);
    message.text.body = rest;

    let scheduled_at = null;
    if ( temp ) {
      scheduled_at = DateService.parse(temp, user.timezone);

      this.senderService.textToUser(
        user.id,
        [[
          'Ok. Message scheduled for :date', {
            date: DateService.toMessage(
              scheduled_at.toDate(),
              user.language,
              user.timezone,
            ),
          },
        ]]
      );
    } else {
      this.senderService.textToUser(
        user.id,
        'I don\'t understand when you want to schedule this last message. To schedule it, please reply to it and indicate when you want to receive it. Thank you!'
      );
    }

    await this.messageService.firstOrCreate({
      user_id: user.id,
      text: message.text.body,
      whatsapp_id: message.id,
      type: message.type,
      schedule: temp || null,
      scheduled_at: scheduled_at?.toDate(),
    });
  }
}