import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription, SubscriptionDocument } from './schemas/subscription.schema';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async create(subscription) {
    try {
      return await this.subscriptionModel.create(subscription);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(query) {
    try {
      const deleted = await this.subscriptionModel
        .findOneAndUpdate({ ...query, deleted_at: null }, { deleted_at: new Date })
        .populate('user');
      if ( !deleted ) throw new Error("Not found");
      return deleted;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async update(query, data) {
    try {
      return await this.subscriptionModel.findOneAndUpdate(
        { ...query, deleted_at: null },
        data,
        { upsert: true, new: true },
      ).populate('user');
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      return await this.subscriptionModel.findOne({ ...query, deleted_at: null });
    } catch (error) {
      console.error(error);
    }
  }
}
