import { SubscriptionRepository } from '@domain/subscription/subscription.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async create(meta) {
    return await this.subscriptionRepository.create({
      user_id: meta.metadata.user_id,
      meta,
    });
  }

  async update(meta) {
    return await this.subscriptionRepository.update(
      { user_id: meta.metadata.user_id },
      { meta }
    );
  }

  async delete(user_id) {
    return await this.subscriptionRepository.delete({ user_id });
  }
}
