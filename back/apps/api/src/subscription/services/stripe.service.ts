import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
  stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_KEY, {
      apiVersion: '2022-08-01',
    });
  }

  async findOrCreateCustomer(userId, data) {
    const { data: customers } = await this.stripe.customers.search({
      query: `metadata['id']:'${userId}'`,
      limit: 1,
    });

    if ( customers[0] ) {
      await this.stripe.paymentMethods.attach(
        data.payment_method,
        { customer: customers[0].id },
      );
      await this.stripe.customers.update(
        customers[0].id, {
          invoice_settings: {
            default_payment_method: data.payment_method,
          },
        }
      );
    }

    return customers[0] || await this.stripe.customers.create({
      ...data,
      metadata: {
        id: userId,
        env: process.env.ENV,
      },
      invoice_settings: {
        default_payment_method: data.payment_method,
      },
    });
  }

  async createSubscription(payload) {
    try {
      return await this.stripe.subscriptions.create(payload);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getPrices() {
    return await this.stripe.prices.list({
      product: process.env.STRIPE_SUBSCRIPTION_PRODUCT,
    });
  }

  constructEvent(req, sig) {
    return this.stripe.webhooks.constructEvent(
      req['rawBody'],
      sig,
      process.env.STRIPE_ENDPOINT_SECRET,
    );
  }
}
