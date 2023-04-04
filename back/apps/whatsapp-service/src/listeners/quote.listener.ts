import { Injectable } from "@nestjs/common";
import { ReminderHandler } from "../handlers/reminder.handler";
import { ParserService } from "../services/parser.service";
import { MessageService } from "@domain/message/message.service";

@Injectable()
export class QuoteListener {
  constructor(
    private readonly messageService: MessageService,
    private readonly reminderHandler: ReminderHandler,
    private readonly parserService: ParserService,
  ) {}

  async handle(user, message) {
    if ( !message.context ) return false;

    const quoted = await this.messageService
      .findOne({ whatsapp_id: message.context.id });

    if ( !quoted ) return;

    const { temp } = await this.parserService.parse(message.text.body);
    if ( temp ) await this.reminderHandler.handle(user, quoted, temp);
  }
}
