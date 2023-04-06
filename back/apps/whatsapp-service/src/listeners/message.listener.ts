import { MessageService } from '@domain/message/message.service';
import { Injectable } from '@nestjs/common';
import { ParserService } from '../services/parser.service';
import { DateService } from '@shared/services/date.service';
import { SenderService } from '../services/sender.service';

@Injectable()
export class MessageListener {
  constructor(
    private readonly messageService: MessageService,
    private readonly parserService: ParserService,
    private readonly senderService: SenderService,
  ) {}

  async handle(user, message) {
    const { temp, rest } = await this.parserService.parse(message.text.body);

    const m = await this.messageService.firstOrCreate({
      user_id: user.id,
      text: rest,
      whatsapp_id: message.id,
      type: message.type,
      schedule: temp || null,
      sent_text: message.text.body,
    });

    const scheduled_at = DateService.parse(temp, user.timezone);

    const response: any = ( !temp || !scheduled_at )
      ? 'I don\'t understand when you want to schedule this last message. To schedule it, please reply to it and indicate when you want to receive it'
      : [
        rest,
        '',
        [
          'Message scheduled for :date',
          {
            date: DateService.toMessage(
              scheduled_at.toDate(),
              user.language,
              user.timezone,
            ),
          },
        ]
      ];

    const sent = await this.senderService.textToUser(user.id, response);

    m.scheduled_at = scheduled_at?.toDate();
    m.related_message_ids.push(sent.id);
    await m.save();
  }
}
