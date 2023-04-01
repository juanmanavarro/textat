import { PostService } from "@domain/post/post.service";
import { Injectable } from "@nestjs/common";
import { TransportService } from "@transport/transport";
import { ReminderHandler } from "../handlers/reminder.handler";
import { ParserService } from "../services/parser.service";

@Injectable()
export class QuoteListener {
  constructor(
    private readonly postService: PostService,
    private readonly transportService: TransportService,
    private readonly reminderHandler: ReminderHandler,
  ) {}

  async handle(user, message) {
    if ( !message.context ) return false;

    const quoted = await this.postService
      .findOne({ whatsapp_id: message.context.id });
    if ( !quoted ) return false;

    const {
      comment,
      schedule
    } = ParserService.extractEntities(message.text.body);

    if ( schedule ) await this.reminderHandler.handle(user, quoted, schedule);
    if ( comment ) quoted.comments.push(comment);

    await quoted.save();

    this.transportService.send('post:updated', {
      id: user.id,
      data: { post: quoted },
    });

    return true;
  }
}
