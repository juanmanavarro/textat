import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async firstOrCreate(query) {
    try {
      let category = await this.categoryModel.findOne(query).populate('post_count');
      if ( !category ) {
        category = await (await this.categoryModel.create(query)).populate('post_count');
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
      const categorys = await this.categoryModel.find({ user_id })
        .select('-created_at -user_id -id')
        .populate('post_count')
        .sort('-created_at');
      return categorys;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async create(category) {
    try {
      return await this.categoryModel.create(category);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(categoryId) {
    try {
      const response = await this.categoryModel.deleteOne({
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
      return await this.categoryModel.findByIdAndUpdate(
        id,
        data,
        { new: true },
      ).populate('post_count');
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      return await this.categoryModel.findOne(query);
    } catch (error) {
      console.error(error);
    }
  }
}
