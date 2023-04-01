import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '@domain/user/user.service';
import { WsService } from '@transport/transport/services/ws.service';

/**
 * Send message reminding the subscription end
 */
@Injectable()
export class SubscriptionTask {
  constructor(
    private readonly userService: UserService,
    private readonly wsService: WsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendEndNotification() {
    const users = await this.userService.findEndingSubscription();
    console.log(users);

    for (const user of users) {
      await this.wsService.send(user.id, 'subscription:notify');
      // TODO  mark subscription notified
    }
  }
}
