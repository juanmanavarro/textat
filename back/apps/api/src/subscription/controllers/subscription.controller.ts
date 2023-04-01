import { SubscriptionRepository } from '@domain/subscription/subscription.repository';
import { JwtAuthGuard } from '@domain/user/guards/jwt-auth.guard';
import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { StripeService } from '../services/stripe.service';
import { TrialService } from '../services/trial.service';
import { UserService } from '@domain/user/user.service';

@Controller('subscriptions')
export class SubscriptionController {
  private logger = new Logger('SubscriptionController');

  constructor(
    private readonly stripeService: StripeService,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async subscription(@Req() req, @Res() res: Response) {
    const subscription = await this.subscriptionRepository.findOne({
      user_id: req.user.id,
    });

    return res.status(HttpStatus.OK).json({
      subscription: subscription ? subscription['toResponse']() : null,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(@Body() body, @Res() res: Response) {
    const stripeSubscriptions = await this.stripeService.stripe
      .subscriptions.search({
        query: `metadata['user_id']:'${body.user.id}'`,
      });

    const isSubscribed = stripeSubscriptions.data.length
      && !['incomplete', 'incomplete_expired', 'canceled'].includes(
        stripeSubscriptions.data?.[stripeSubscriptions.data.length - 1].status
      );
    if ( isSubscribed ) {
      return res.status(HttpStatus.OK)
        .json({ message: 'user_subscribed' });
    }

    let customer;
    try {
      customer = await this.stripeService.findOrCreateCustomer(body.user.id, {
        name: body.user.username,
        payment_method: body.payment_method_id,
      });
      if ( !customer ) throw new Error('create_customer_error');
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message });
    }

    await this.userService.update(
      { _id: body.user.id },
      { stripe_id: customer.id },
    );

    let subscription;
    try {
      const subPayload = {
        metadata: { user_id: body.user.id },
        customer: customer.id,
        items: [{ plan: body.plan_id }],
        expand: [ "latest_invoice.payment_intent" ],
        trial_end: TrialService.trialEnd(body.user.registered_at),
      };

      subscription = await this.stripeService.createSubscription(subPayload);
      if ( !subscription ) throw new Error("Unable to create Stripe subscription.");
    } catch (error) {
      this.logger.error(error.message);

      return res.status(HttpStatus.BAD_REQUEST)
        .json({ message: 'subscription_no_created' });
    }

    return ['active', 'trialing'].includes(subscription.status)
      ? res.sendStatus(HttpStatus.OK)
      : res.status(HttpStatus.BAD_REQUEST).json({
          payment_client_secret: subscription.latest_invoice.payment_intent.client_secret
        });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(@Param() params, @Body() body, @Req() req, @Res() res: Response) {
    const stripeSubscription = await this.stripeService.stripe
      .subscriptions.retrieve(params.id);

    if ( stripeSubscription.metadata.user_id !== req.user.id ) {
      return res.status(HttpStatus.BAD_REQUEST)
        .json({ message: 'user_not_subscribed' });
    }

    try {
      const updated = await this.stripeService.stripe
        .subscriptions.update(stripeSubscription.id, {
          cancel_at_period_end: body.cancel,
        });
      if ( !updated ) throw new Error("Can't activate subscription");
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }

    return res.sendStatus(HttpStatus.OK);
  }
}
