import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { ParserService } from 'apps/whatsapp-service/src/services/parser.service';
import { DateService } from '@shared/services/date.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async findScheduled(user_id) {
    const date = DateService.dayjs();
    const scheduleQuery = {
      $gte: date.startOf('minute').toDate(),
    };

    try {
      return await this.messageModel.find({
        user_id,
        scheduled_at: scheduleQuery,
      }).populate('user');
    } catch (error) {
      console.error(error);
    }
  }

  async findReminders() {
    const date = DateService.dayjs();
    try {
      return await this.messageModel.find({
        scheduled_at: {
          $gte: date.startOf('minute').toDate(),
          $lt: date.startOf('minute').add(1, 'minute').toDate(),
        },
      }).populate('user');
    } catch (error) {
      console.error(error);
    }
  }

  async dates(query) {
    return await this.messageModel.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(query.user_id) } },
      {
        $project: {
          created_at: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }
        },
      },
      {
        $group: {
          _id: '$created_at',
          created_at: { $first: '$created_at' },
          count: { $count: { } },
        },
      },
      { $unset: '_id' },
    ]);
  }

  async create(message, data) {
    try {
      return await this.messageModel.create(message);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async firstOrCreate(message) {
    try {
      let created = await this.messageModel.findOne({
        whatsapp_id: message.whatsapp_id,
      });
      if ( !created ) {
        created = await this.messageModel.create(message);
        created['is_new'] = true;
      }
      return created;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(userId, messageId) {
    try {
      const response = await this.messageModel.deleteOne({
        user_id: userId,
        _id: messageId,
      });
      if ( !response.deletedCount ) throw new Error("Not found");
      return messageId;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async update(id, data) {
    try {
      return await this.messageModel.findByIdAndUpdate(
        id,
        data,
        { new: true },
      );
    } catch (error) {
      console.error(error);
    }
  }

  async updateMany(query, data) {
    try {
      return await this.messageModel.updateMany(
        query,
        data,
        // { new: true },
      );
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      return await this.messageModel.findOne(query);
    } catch (error) {
      console.error(error);
    }
  }
}
