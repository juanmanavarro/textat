import { Injectable } from '@nestjs/common';
import { TransportService } from '@transport/transport';
import { PostMapperService } from '../services/post-mapper.service';
import { MessageService } from '@domain/message/message.service';
import { ParserService } from '../services/parser.service';
import { DateService } from '@shared/services/date.service';

@Injectable()
export class PostListener {
  constructor(
    private readonly postMapperService: PostMapperService,
    private readonly messageService: MessageService,
    private readonly transportService: TransportService,
    private readonly parserService: ParserService,
  ) {}

  async handle(user, message) {
    const { temp, rest } = await this.parserService.parse(message.text.body);
    message.text.body = rest;

    let scheduled_at = null;
    if ( temp ) {
      scheduled_at = DateService.parse(temp, user.timezone);
    }

    const maps = await this.postMapperService.map(user, message);
    for (const mapped of maps) {
      const post = await this.messageService.firstOrCreate({
        ...mapped,
        schedule: temp || null,
        scheduled_at: scheduled_at?.toDate(),
      });
      if ( !post['is_new'] ) continue;

      this.transportService.send('post:created', {
        id: user.id,
        data: { post },
      });
    }

    return true;
  }
}
