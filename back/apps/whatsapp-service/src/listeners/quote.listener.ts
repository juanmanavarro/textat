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
    private readonly parserService: ParserService,
  ) {}

  async handle(user, message) {
    if ( !message.context ) return false;

    const quoted = await this.messageService
      .findOne({ whatsapp_id: message.context.id });
    if ( !quoted ) return false;

    // if ( message.text.body.startsWith('/') ) {
    //   this.commandHandler.handle(user, message);
    //   return;
    // }

    const { temp } = await this.parserService.parse(message.text.body);
    if ( temp ) await this.reminderHandler.handle(user, quoted, temp);

    await quoted.save();

    this.transportService.send('post:updated', {
      id: user.id,
      data: { post: quoted },
    });

    return true;
  }
}
