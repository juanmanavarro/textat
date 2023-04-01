import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async firstOrCreate(query) {
    try {
      let tag = await this.tagModel.findOne(query);
      if ( !tag ) {
        tag = await this.tagModel.create(query);
        tag['is_new'] = true;
      }
      return tag;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async find(user_id) {
    try {
      const tags = await this.tagModel.find({ user_id })
        .select('-created_at -user_id -id');
      return tags;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async create(tag) {
    try {
      return await this.tagModel.create(tag);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(userId, tagId) {
    try {
      const response = await this.tagModel.deleteOne({
        user_id: userId,
        _id: tagId,
        is_sent: false
      });
      if ( !response.deletedCount ) throw new Error("Not found");
      return tagId;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async update(id, data) {
    try {
      return await this.tagModel.findByIdAndUpdate(
        id,
        data,
        { new: true },
      );
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      return await this.tagModel.findOne(query);
    } catch (error) {
      console.error(error);
    }
  }
}
