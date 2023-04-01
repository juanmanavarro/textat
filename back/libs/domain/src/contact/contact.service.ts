import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async firstOrCreate(query) {
    try {
      let category = await this.contactModel.findOne(query).populate('post_count');
      if ( !category ) {
        category = await (await this.contactModel.create(query)).populate('post_count');
        category['is_new'] = true;
      }
      return category;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async find(user_id) {
    try {
      const contacts = await this.contactModel.find({ user_id })
        .select('-created_at -user_id -id')
        .populate('post_count')
        .sort('-created_at');
      return contacts;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async create(category) {
    try {
      return await this.contactModel.create(category);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(categoryId) {
    try {
      const response = await this.contactModel.deleteOne({
        _id: categoryId,
      });
      if ( !response.deletedCount ) throw new Error("Not found");
      return categoryId;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async update(id, data) {
    try {
      return await this.contactModel.findByIdAndUpdate(
        id,
        data,
        { new: true },
      ).populate('admin');
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      return await this.contactModel.findOne(query);
    } catch (error) {
      console.error(error);
    }
  }
}
