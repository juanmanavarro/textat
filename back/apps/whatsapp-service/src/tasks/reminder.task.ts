import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MessageService } from '@domain/message/message.service';
import { SenderService } from '../services/sender.service';
import { DateService } from '@shared/services/date.service';

/**
 * Send reminder messages
 */

@Injectable()
export class ReminderTask {
  constructor(
    private readonly messageService: MessageService,
    private readonly senderService: SenderService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async send() {
    const date = DateService.dayjs();
    const messages = await this.messageService.findReminders({
      scheduled_at: {
        $gte: date.startOf('minute').toDate(),
        $lt: date.startOf('minute').add(1, 'minute').toDate(),
      },
    });
    for (const m of messages) {
      const message = [
        m.toReminder(),
        '',
        `⏰ _Reminder_`
      ];
      this.senderService.textToUser(m['user'].id, message);
      // TODO remove
      await new Promise(r => setTimeout(r, 500));
    }
  }
}
