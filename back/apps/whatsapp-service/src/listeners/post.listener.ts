import { PostService } from '@domain/post/post.service';
import { Injectable } from '@nestjs/common';
import { TransportService } from '@transport/transport';
import { PostMapperService } from '../services/post-mapper.service';

@Injectable()
export class PostListener {
  constructor(
    private readonly postMapperService: PostMapperService,
    private readonly postService: PostService,
    private readonly transportService: TransportService,
  ) {}

  async handle(user, message) {
    const maps = await this.postMapperService.map(user, message);
    for (const mapped of maps) {
      const post = await this.postService.firstOrCreate(mapped);
      if ( !post['is_new'] ) continue;

      this.transportService.send('post:created', {
        id: user.id,
        data: { post },
      });
    }

    return true;
  }
}
