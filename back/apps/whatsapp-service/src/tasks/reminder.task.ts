import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostService } from '@domain/post/post.service';
import { SenderService } from '../services/sender.service';
import { DateService } from '@shared/services/date.service';

/**
 * Send reminder posts
 */

@Injectable()
export class ReminderTask {
  constructor(
    private readonly postService: PostService,
    private readonly senderService: SenderService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async send() {
    const date = DateService.dayjs();
    const posts = await this.postService.findReminders({
      scheduled_at: {
        $gte: date.startOf('minute').toDate(),
        $lt: date.startOf('minute').add(1, 'minute').toDate(),
      },
    });
    for (const post of posts) {
      const message = [
        post['message'],
        '',
        `⏰ _Reminder_`
      ];
      this.senderService.textToUser(post['user'].id, message);
      // TODO remove
      await new Promise(r => setTimeout(r, 500));
    }
  }
}
