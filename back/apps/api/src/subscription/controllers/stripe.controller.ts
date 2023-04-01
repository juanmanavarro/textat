import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LogsService } from '@shared/services/logs.service';
import { StripeService } from '../services/stripe.service';
import { Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { WsService } from '@transport/transport/services/ws.service';
import { JwtAuthGuard } from '@domain/user/guards/jwt-auth.guard';
import { UserService } from '@domain/user/user.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly logsService: LogsService,
    private readonly wsService: WsService,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/prices')
  async prices(@Res() res: Response) {
    const { data: prices } = await this.stripeService.getPrices();
    return res.status(HttpStatus.OK).json({ prices });
  }

  /**
   * https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local
   */
  @Post('/webhook')
  async webhooks(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = this.stripeService.constructEvent(req, sig);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook error: ${error.message}`);
    }

    this.logsService.stripe(event.type, event);

    switch (event.type) {
      case 'customer.subscription.deleted':
        if ( !event.data.object ) break;

        const deleted = await this.subscriptionService
          .delete(event.data.object.metadata.user_id);
        if ( !deleted ) break;

        this.wsService.send(deleted.user_id, 'stripe:subscription', {
          subscription: null,
        });
        break;
      case 'customer.subscription.created':
        if ( !event.data.object ) break;

        const created = await this.subscriptionService
          .create(event.data.object);
        if ( !created ) break;

        this.wsService.send(created.user_id, 'stripe:subscription', {
          subscription: created['toResponse'](),
        });
        break;
      case 'customer.subscription.updated':
        if ( !event.data.object ) break;

        const updated = await this.subscriptionService
          .update(event.data.object);

        if ( !updated ) break;

        this.wsService.send(updated.user_id, 'stripe:subscription', {
          subscription: updated['toResponse'](),
        });
        break;
      case 'invoice.payment_action_required':
        const user = await this.userService
          .findOne({ stripe_id: event.data.object.customer });
        this.wsService.send(
          user._id,
          'stripe:invoice.payment_action_required'
        );
        break;
      default:
        break;
    }

    return res.sendStatus(HttpStatus.OK);
  }
}
