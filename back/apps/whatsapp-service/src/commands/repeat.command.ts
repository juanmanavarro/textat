import { Injectable } from "@nestjs/common";
import { SenderService } from "../services/sender.service";
import { ParserService } from "../services/parser.service";
import { MessageService } from "@domain/message/message.service";
import { DateService } from '@shared/services/date.service';
import { repeatMessage } from "../messages/repeat.message";
import { REPEAT_PARAMETERS } from "../whastapp-service.constants";

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

    if ( !rest || !Object.keys(REPEAT_PARAMETERS).includes(rest) ) {
      this.senderService.textToUser(user.id, [
        'The parameter is missing or incorrect, use it as follows:',
        '',
        repeatMessage,
      ]);
      return;
    }

    repeteable.repeat = rest;

    // TODO improve message
    const sent = await this.senderService.textToUser(user.id, [
      `${repeteable.text}`,
      '',
      `🔁 Next schedule for ${DateService.toMessage(repeteable.scheduled_at, user.language, user.timezone)}`
    ]);

    repeteable.related_message_ids.push(sent.id);
    await repeteable.save();
  }
}
