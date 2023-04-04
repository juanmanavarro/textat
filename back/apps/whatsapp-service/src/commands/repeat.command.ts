import { Injectable } from "@nestjs/common";
import { SenderService } from "../services/sender.service";
import { ParserService } from "../services/parser.service";
import { MessageService } from "@domain/message/message.service";
import { DateService } from '@shared/services/date.service';
import { repeatMessage } from "../messages/repeat.message";

@Injectable()
export class RepeatCommand {
  constructor(
    private readonly senderService: SenderService,
    private readonly messageService: MessageService,
  ) {}

  async execute(user, message) {
    const { rest } = ParserService.command(message);

    const repeteable = await this.messageService.findOne({
      $or: [
        { whatsapp_id: message.context.id, },
        { related_message_ids: message.context.id },
      ],
      scheduled_at: { $ne: null },
    });
    if ( !repeteable ) {
      this.senderService.textToUser(user.id, 'The message must be programmed before repeating');
      return;
    }

    if ( !rest || !['y', 'm', 'd', 'h', 'mi' ].includes(rest) ) {
      this.senderService.textToUser(user.id, [
        'The parameter is missing or incorrect, use it as follows:',
        '',
        repeatMessage,
      ]);
      return;
    }

    repeteable.repeat = rest;
    await repeteable.save();

    // TODO improve message
    this.senderService.textToUser(user.id, [
      `${repeteable.text}`,
      '',
      `🔁 Next schedule for ${DateService.toMessage(repeteable.scheduled_at, user.language, user.timezone)}`
    ]);
  }
}
