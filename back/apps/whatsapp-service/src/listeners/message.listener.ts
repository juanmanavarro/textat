import { MessageService } from '@domain/message/message.service';
import { Injectable } from '@nestjs/common';
import { ParserService } from '../services/parser.service';
import { DateService } from '@shared/services/date.service';
import { MessageType } from 'apps/whatsapp-service/src/services/post-mapper.service';

@Injectable()
export class MessageListener {
  constructor(
    private readonly messageService: MessageService,
    private readonly parserService: ParserService,
  ) {}

  async handle(user, message) {
    if ( message.type !== MessageType.TEXT ) return;

    const { temp, rest } = await this.parserService.parse(message.text.body);
    message.text.body = rest;

    let scheduled_at = null;
    if ( temp ) {
      scheduled_at = DateService.parse(temp, user.timezone);
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
