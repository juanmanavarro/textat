import { Injectable } from '@nestjs/common';
import { DateService } from '@shared/services/date.service';
import { SenderService } from '../services/sender.service';

@Injectable()
export class ReminderHandler {
  constructor(
    private readonly senderService: SenderService,
  ) {}

  async handle(user, post, schedule) {
    let sent = null;

    const scheduled_at = DateService.parse(schedule, user.timezone);

    if ( post['is_media'] ) {
      sent = await this.senderService.textToUser(
        user.id,
        'Sorry, at the moment it is not possible to set reminders for messages of this type'
      );
    }
    else if ( !scheduled_at?.isValid() ) {
      sent = await this.senderService.textToUser(
        user.id,
        [[ 'Sorry, I do not recognize :schedule', { schedule: `*${schedule}*` } ]],
      );
    }
    else if ( DateService.isPast(scheduled_at.toDate()) ) {
      sent = await this.senderService.textToUser(
        user.id,
        'Cannot be scheduled, I cannot travel to the past yet 😉'
      );
    }
    else {
      post.scheduled_at = scheduled_at.toDate();

      sent = await this.senderService.textToUser(
        user.id,
        [
          post.text,
          '',
          [
            'Message scheduled for :date',
            { date: DateService.toMessage(scheduled_at.toDate(), user.language, user.timezone) },
          ]
        ]
      );

      post.related_message_ids.push(sent.id);
      await post.save();
    }
  }
}
