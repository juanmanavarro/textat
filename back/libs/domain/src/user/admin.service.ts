import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { HasherService } from '@shared/services/hasher.service';
import { DateService } from '@shared/services/date.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async firstOrCreate(query) {
    try {
      let admin = await this.adminModel.findOne({ email: query.email });
      if ( !admin ) {
        admin = await this.adminModel.create(query);
        admin['is_new'] = true;
      }
      return admin;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async all() {
    try {
      return await this.adminModel.find();
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      return await this.adminModel
        .findOne(query);
    } catch (error) {
      console.error(error);
    }
  }

  async findByIdAndUpdate(id, data) {
    try {
      return await this.adminModel
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
      return await this.adminModel
        .findOneAndUpdate(query, data, { new: true });
    } catch (error) {
      console.error(error);
    }
  }

  async findEndingSubscription() {
    return await this.adminModel.aggregate([
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
    return await this.adminModel.find({
      registered_at: {
        $gt: DateService.dayjs().subtract(1, 'month').toDate(),
        $lt: DateService.dayjs().subtract(1, 'month').add(1, 'day').toDate(),
      }
    });
  }
}
