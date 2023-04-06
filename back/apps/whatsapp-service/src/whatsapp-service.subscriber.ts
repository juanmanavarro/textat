import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SenderService } from './services/sender.service';
import { FormatService } from './services/format.service';
import { DateService } from '@shared/services/date.service';

@Controller()
export class WhatsappServiceSubscriber {
  constructor(
    private readonly senderService: SenderService,
  ) {}

  @MessagePattern('stripe:subscription')
  async onSubscription(@Payload() payload) {
    if ( !payload.data.subscription ) {
      this.senderService.textToUser(
        payload.id,
        'Your subscription is terminated. You are back in the Basic plan',
      );
      return;
    }

    if ( !['active', 'trialing'].includes(payload.data.subscription.status) ) return;

    const message = payload.data.subscription.cancel_at_period_end
      ? 'Premium Plan cancelled. It will not be renewed at the end of the period'
      : 'Premium Plan activated. To be renewed at the end of the period 🙂';

    this.senderService.textToUser(payload.id, message);
  }

  @MessagePattern('subscription:notify')
  async onSubscriptionNotify(@Payload() payload) {
    await this.senderService.textToUser(payload.id, [
      'Hello, your subscription will end soon and will not be renewed. You can renew it here:',
      '',
      process.env.WEBAPP_HOST + '/subscription',
    ]);
  }

  @MessagePattern('contact:answered')
  async onContactAnswered(@Payload() { contact }) {
    await this.senderService.textToUser(contact.user_id, [
      [ ':email from TextPocket', { email: contact.admin.email } ],
      '',
      contact.response,
      '',
      [
        'In reply to your contact message :date',
        { date: DateService.toMessage(contact.created_at) },
      ],
      '',
      FormatService.italic(`"${contact.message}"`),
      '',
    ]);
  }
}
