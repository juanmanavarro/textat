import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { HasherService } from '@shared/services/hasher.service';
import { DateService } from '@shared/services/date.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async find(query) {
    try {
      return await this.userModel.find(query);
    } catch (error) {
      console.error(error);
    }
  }

  async firstOrCreate(query) {
    try {
      let user = await this.userModel.findOne({
        whatsapp_id: HasherService.hash(query.whatsapp_id),
      });
      if ( !user ) {
        user = await this.userModel.create(query);
        user['is_new'] = true;
      }
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async all() {
    try {
      return await this.userModel.find()
        .sort('-registered_at');
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      return await this.userModel
        .findOne(query)
        .select('-password -whatsapp_id');
    } catch (error) {
      console.error(error);
    }
  }

  async findByIdAndUpdate(id, data) {
    try {
      return await this.userModel
        .findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error(error);
    }
  }

  async update(query, data) {
    if ( query.whatsapp_id ) {
      query.whatsapp_id = HasherService.hash(query.whatsapp_id);
    }

    try {
      return await this.userModel
        .findOneAndUpdate(query, data, { new: true });
    } catch (error) {
      console.error(error);
    }
  }

  async findEndingSubscription() {
    return await this.userModel.aggregate([
      {
        $lookup: {
          from: 'subscriptions',
          localField: '_id',
          foreignField: 'user_id',
          as: 'subscription',
          let: { deleted_at: '$deleted_at' },
          pipeline: [
            {
              $match: {
                deleted_at: null,
              }
            }
          ]
        }
      },
      {
        $project: {
          id: '$_id',
          subscription: {
            $arrayElemAt: [ "$subscription", 0 ],
          }
        }
      },
      {
        $project: {
          id: '$id',
          subscription_ends_at: {
            $toDate: { $multiply: [ '$subscription.meta.current_period_end', 1000 ] },
          },
          cancel_at_period_end: '$subscription.meta.cancel_at_period_end',
        }
      },
      {
        $match: {
          subscription_ends_at: {
            $gt: DateService.dayjs().startOf('day').toDate(),
            $lt: DateService.dayjs().startOf('day').add(1, 'day').toDate(),
          },
          cancel_at_period_end: true,
        }
      }
    ]);
  }

  async findEndingTrial() {
    return await this.userModel.find({
      registered_at: {
        $gt: DateService.dayjs().subtract(1, 'month').toDate(),
        $lt: DateService.dayjs().subtract(1, 'month').add(1, 'day').toDate(),
      }
    });
  }

  async getLanguage(id) {
    try {
      const { language } = await this.userModel
        .findById(id);
      return language;
    } catch (error) {
      console.error(error);
    }
  }
}
