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
    const messages = await this.messageService.findReminders();
    for (const message of messages) {
      const reminder = await this.senderService.remind(message);
      // TODO remove
      await new Promise(r => setTimeout(r, 500));
    }
  }
}
