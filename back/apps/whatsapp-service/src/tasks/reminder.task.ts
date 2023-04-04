import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MessageService } from '@domain/message/message.service';
import { SenderService } from '../services/sender.service';
import { DateService } from '@shared/services/date.service';
import { REPEAT_PARAMETERS } from '../whastapp-service.constants';

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
      if ( message.repeat ) {
        message.scheduled_at = DateService.dayjs(message.scheduled_at)
          .add(1, REPEAT_PARAMETERS[message.repeat]);
      }

      message.related_message_ids.push(reminder.id);
      await message.save();

      // TODO remove
      await new Promise(r => setTimeout(r, 500));
    }
  }
}
