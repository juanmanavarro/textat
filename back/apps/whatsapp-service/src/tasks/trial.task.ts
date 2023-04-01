import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SenderService } from '../services/sender.service';
import { UserService } from '@domain/user/user.service';

/**
 * Send message reminding the trial end
 */
@Injectable()
export class TrialTask {
  constructor(
    private readonly userService: UserService,
    private readonly senderService: SenderService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async check() {
    const users = await this.userService.findEndingTrial();
    for (const user of users) {
      if ( user['subscribed'] ) continue;
      this.senderService.textToUser(user.id, [
        'Hello, the trial period ends soon. In order not to lose the advantages of the Premium plan you can activate it here:',
        '',
        process.env.WEBAPP_HOST + '/subscription',
      ]);
    }
  }
}
