import { Injectable } from "@nestjs/common";
import { TransportService } from "@transport/transport";
import { ReminderHandler } from "../handlers/reminder.handler";
import { ParserService } from "../services/parser.service";
import { MessageService } from "@domain/message/message.service";

@Injectable()
export class QuoteListener {
  constructor(
    private readonly messageService: MessageService,
    private readonly transportService: TransportService,
    private readonly reminderHandler: ReminderHandler,
  ) {}

  async handle(user, message) {
    if ( !message.context ) return false;

    const quoted = await this.messageService
      .findOne({ whatsapp_id: message.context.id });
    if ( !quoted ) return false;

    const {
      schedule
    } = ParserService.extractEntities(message.text.body);

    if ( schedule ) await this.reminderHandler.handle(user, quoted, schedule);

    await quoted.save();

    this.transportService.send('post:updated', {
      id: user.id,
      data: { post: quoted },
    });

    return true;
  }
}
