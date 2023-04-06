import { Injectable } from "@nestjs/common";
import { SenderService } from "../services/sender.service";
import { ParserService } from "../services/parser.service";
import { MessageService } from "@domain/message/message.service";
import { DateService } from '@shared/services/date.service';
import { REPEAT_PARAMETERS } from "../whastapp-service.constants";
import { RepeatMessage } from '../messages/repeat.message';

@Injectable()
export class RepeatCommand {
  constructor(
    private readonly senderService: SenderService,
    private readonly messageService: MessageService,
    private readonly repeatMessage: RepeatMessage,
  ) {}

  async execute(user, message) {
    const { rest } = ParserService.command(message);

    const repeteable = await this.messageService.findOne({
      $or: [
        { whatsapp_id: message.context.id, },
        { related_message_ids: message.context.id },
      ],
    });

    if ( !repeteable ) {
      this.senderService.textToUser(user.id, 'This message cannot be repeated');
      return;
    }

    if ( !rest || !Object.keys(REPEAT_PARAMETERS).includes(rest) ) {
      this.senderService.textToUser(user.id, [
        'The parameter is missing or incorrect, use it as follows:',
        '',
        this.repeatMessage.body(),
      ]);
      return;
    }

    if ( !repeteable.scheduled_at ) {
      repeteable.scheduled_at = DateService.dayjs().add(1, REPEAT_PARAMETERS[rest]).toDate();
    }

    if ( DateService.isPast(repeteable.scheduled_at) ) {
      const differenceSeconds = DateService.dayjs().unix() - DateService.dayjs(repeteable.scheduled_at).unix();
      const scheduledAt = DateService.dayjs(repeteable.scheduled_at).add(differenceSeconds, 'second');
      repeteable.scheduled_at = scheduledAt.add(1, REPEAT_PARAMETERS[rest]);
    }

    repeteable.repeat = rest;

    const sent = await this.senderService.textToUser(user.id, [
      `${repeteable.text}`,
      '',
      `🔁 Next schedule for ${DateService.toMessage(repeteable.scheduled_at, user.language, user.timezone)}`
    ]);

    repeteable.related_message_ids.push(sent.id);
    await repeteable.save();
  }
}
