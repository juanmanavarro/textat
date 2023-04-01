import { Injectable } from '@nestjs/common';
import { TransportService } from '@transport/transport';
import { PostMapperService } from '../services/post-mapper.service';
import { MessageService } from '@domain/message/message.service';

@Injectable()
export class PostListener {
  constructor(
    private readonly postMapperService: PostMapperService,
    private readonly messageService: MessageService,
    private readonly transportService: TransportService,
  ) {}

  async handle(user, message) {
    const maps = await this.postMapperService.map(user, message);
    for (const mapped of maps) {
      const post = await this.messageService.firstOrCreate(mapped);
      if ( !post['is_new'] ) continue;

      this.transportService.send('post:created', {
        id: user.id,
        data: { post },
      });
    }

    return true;
  }
}
