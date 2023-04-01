import { PostService } from "@domain/post/post.service";
import { TagService } from "@domain/tag/tag.service";
import { Injectable } from "@nestjs/common";
import { TransportService } from "@transport/transport";
import { ReminderHandler } from "../handlers/reminder.handler";
import { ParserService } from "../services/parser.service";

@Injectable()
export class QuoteListener {
  constructor(
    private readonly postService: PostService,
    private readonly tagService: TagService,
    private readonly transportService: TransportService,
    private readonly reminderHandler: ReminderHandler,
  ) {}

  async handle(user, message) {
    if ( !message.context ) return false;

    const quoted = await this.postService
      .findOne({ whatsapp_id: message.context.id });
    if ( !quoted ) return false;

    const {
      tags,
      comment,
      schedule
    } = ParserService.extractEntities(message.text.body);

    for (const tag of tags) {
      const saved = await this.tagService.firstOrCreate({
        label: tag,
        user_id: user.id,
      });

      if ( !saved ) continue;

      this.transportService.send('tag:created', {
        id: user.id,
        data: { tag: saved },
      });

      quoted.tags.addToSet(saved._id);
    }

    if ( schedule ) await this.reminderHandler.handle(user, quoted, schedule);
    if ( comment ) quoted.comments.push(comment);

    await quoted.save();

    this.transportService.send('post:updated', {
      id: user.id,
      data: { post: await quoted.populate('tags category') },
    });

    return true;
  }
}
