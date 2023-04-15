import { Injectable } from "@nestjs/common";
import { ParserService } from "../services/parser.service";
import { MessageService } from "@domain/message/message.service";
import { SenderService } from "../services/sender.service";
import { DateService } from "@shared/services/date.service";
import { REPEAT_PARAMETERS } from "../whastapp-service.constants";
import { TranslatorService } from "../services/translator.service";

@Injectable()
export class QuoteListener {
  constructor(
    private readonly messageService: MessageService,
    private readonly parserService: ParserService,
    private readonly senderService: SenderService,
    private readonly translatorService: TranslatorService,
  ) {}

  async handle(user, message) {
    if ( !message.context ) return false;

    const quoted = await this.messageService
      .findOne({
        $or: [
          { whatsapp_id: message.context.id, },
          { related_message_ids: message.context.id },
        ],
      });

    if ( !quoted ) {
      this.senderService.textToUser(user.id, 'This message cannot be scheduled');
      return;
    }

    const { temp } = await this.parserService.parse(message.text.body);

    if ( !temp ) {
      this.senderService.textToUser(user.id, [[ 'Sorry, I do not recognize :schedule', { schedule: `*${message.text.body}*` } ]]);
      return;
    }

    const scheduled_at = DateService.parse(temp, user.timezone);

    let response = null;
    if ( !scheduled_at?.isValid() ) {
      response = [[ 'Sorry, I do not recognize :schedule', { schedule: `*${temp}*` } ]];
    }
    else if ( DateService.isPast(scheduled_at.toDate()) ) {
      response = 'Cannot be scheduled, I cannot travel to the past yet 😉';
    }
    else {
      message.scheduled_at = scheduled_at.toDate();
      const dateString = DateService.toMessage(
        scheduled_at.toDate(),
        user.language,
        user.timezone,
      );

      response = message.repeat
        ? [
          '🔁',
          [
            'Repeats every :period. Next schedule for :date',
            {
              date: dateString,
              period: this.translatorService.t(REPEAT_PARAMETERS[message.repeat]),
            },
          ],
        ]
        : [
          message.text.body,
          '',
          [
            'Message scheduled for :date',
            { date: dateString },
          ],
        ];
    }

    const sent = await this.senderService.textToUser(user.id, response);

    quoted.related_message_ids.push(sent.id);
    await quoted.save();
  }
}
