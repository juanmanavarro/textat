import { Injectable } from '@nestjs/common';
import { DateService } from '@shared/services/date.service';
import { SenderService } from '../services/sender.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReminderHandler {
  constructor(
    private readonly senderService: SenderService,
  ) {}

  async handle(user, post, schedule) {
    if ( !user?.subscribed ) {
      this.senderService.textToUser(
        user.id,
        [
          'Sorry, this feature is only available in the Premium plan',
          '',
          [ 'You can activate it from here :url', { url: `${process.env.WEBAPP_HOST}/subscription` } ],
        ],
      );
      return false;
    }

    const scheduled_at = DateService.parse(schedule, user.timezone);
    if ( post['is_media'] ) {
      this.senderService.textToUser(
        user.id,
        'Sorry, at the moment it is not possible to set reminders for messages of this type'
      );
    }
    else if ( !scheduled_at?.isValid() ) {
      this.senderService.textToUser(
        user.id,
        [[ 'Sorry, I do not recognize :schedule', { schedule: `*${schedule}*` } ]],
      );
    }
    else if ( DateService.isPast(scheduled_at.toDate()) ) {
      this.senderService.textToUser(
        user.id,
        'Cannot be scheduled, I cannot travel to the past yet 😉'
      );
    }
    else {
      post.scheduled_at = scheduled_at.toDate();
      await post.save();

      this.senderService.textToUser(
        user.id,
        [
          [
            'Ok. Message scheduled for :date',
            { date: DateService.toMessage(scheduled_at.toDate(), user.language, user.timezone) },
          ]
        ]
      );
    }
  }
}
