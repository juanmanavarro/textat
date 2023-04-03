import { Injectable } from "@nestjs/common";
import { SenderService } from "../services/sender.service";
import { ParserService } from "../services/parser.service";
import { MessageService } from "@domain/message/message.service";
import { FormatService } from '../services/format.service';

@Injectable()
export class RepeatCommand {
  constructor(
    private readonly senderService: SenderService,
    private readonly messageService: MessageService,
  ) {}

  async execute(user, message) {
    const { rest } = ParserService.command(message);

    const repeteable = await this.messageService.findOne({
      whatsapp_id: message.context.id,
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
        `${FormatService.bold('/repeat y')} to be repeated every year`,
        `${FormatService.bold('/repeat m')} to be repeated every month`,
        `${FormatService.bold('/repeat d')} to be repeated every day`,
        `${FormatService.bold('/repeat h')} to be repeated every hout`,
        `${FormatService.bold('/repeat mi')} to be repeated every minute`,
      ]);
      return;
    }

    repeteable.repeat = rest;
    await repeteable.save();

    // TODO improve message
    this.senderService.textToUser(user.id, 'The message will be repeated');
  }
}
