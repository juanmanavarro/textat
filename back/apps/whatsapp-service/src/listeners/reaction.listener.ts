import { CategoryService } from '@domain/category/category.service';
import { PostService } from '@domain/post/post.service';
import { Injectable } from '@nestjs/common';
import { TransportService } from '@transport/transport';

@Injectable()
export class ReactionListener {
  constructor(
    private readonly postService: PostService,
    private readonly categoryService: CategoryService,
    private readonly transportService: TransportService,
  ) {}

  async handle(user, message) {
    if ( !message.reaction ) return false;

    const reactedPost = await this.postService.findOne({
      whatsapp_id: message.reaction.message_id,
    });

    if ( !reactedPost ) return;

    let category = null;
    if ( message.reaction.emoji ) {
      category = await this.categoryService.firstOrCreate({
        emoji: message.reaction.emoji,
        user_id: user.id,
      });
      if ( !category ) return false;
    }

    reactedPost.category = category?.id;
    await reactedPost.save();

    this.transportService.send('post:updated', {
      id: user.id,
      data: {
        post: await reactedPost.populate('tags category')
      },
    });

    this.transportService.send('category:created', {
      id: user.id,
      data: { category: await category?.populate('post_count') },
    });

    return true;
  }
}
