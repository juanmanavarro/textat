import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { ParserService } from 'apps/whatsapp-service/src/services/parser.service';
import { DateService } from '@shared/services/date.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async find(query) {
    // TODO parse to search
    const parsedQuery = ParserService.extractEntities(query.q);

    const match = { user_id: new mongoose.Types.ObjectId(query.user_id) };

    if ( parsedQuery?.comment ) {
      match['$or'] = [
        { text: { $regex: parsedQuery.comment, $options: 'i' } },
        { title: { $regex: parsedQuery.comment, $options: 'i' } },
        { subtitle: { $regex: parsedQuery.comment, $options: 'i' } },
        { comments: { $regex: parsedQuery.comment, $options: 'i' } },
        { link: { $regex: parsedQuery.comment, $options: 'i' } },
      ];
      match['type'] = { $ne: 'unknown' };
    }

    const tagsMatch = {};
    if ( query.tags ) {
      tagsMatch['$or'] = query.tags.map(id => ({ tags: new mongoose.Types.ObjectId(id) }));
    }

    const categoryMatch = {};
    if ( query.categories ) {
      categoryMatch['$or'] = query.categories.map(id => ({ 'category._id': new mongoose.Types.ObjectId(id) }));
    }

    const typesMatch = {};
    if ( query.types ) {
      typesMatch['$or'] = query.types.map(type => ({ type }));
    }

    if ( query.date ) {
      match['$and'] = [
        { created_at: { $gte: DateService.dayjs(query.date).startOf('day').toDate() } },
        { created_at: { $lt: DateService.dayjs(query.date).add(1, 'day').startOf('day').toDate() } },
      ];
    }

    const posts = await this.postModel.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
          pipeline : [
            { $project : { emoji: 1 } }
          ],
        },
      },
      { $match: tagsMatch },
      {
        $lookup: {
          from: 'tags',
          localField: 'tags',
          foreignField: '_id',
          as: 'tags',
          pipeline : [
            { $project : { label: 1 } }
          ],
        },
      },
      { $match: categoryMatch },
      { $match: typesMatch },
      {
        $facet: {
          pagination: [
            {
              $count: 'total',
            },
          ],
          posts: [
            {
              $project: {
                id: '$_id',
                category: { $first: '$category' },
                comments: '$comments',
                created_at: '$created_at',
                sent_at: '$sent_at',
                tags: '$tags',
                type: '$type',
                text: '$text',
                title: '$title',
                subtitle: '$subtitle',
                link: '$link',
                image: '$image',
                content: '$content',
                scheduled_at: '$scheduled_at',
              },
            },
            { $sort: { created_at: -1 } },
            { $skip: Number(query.skip) },
            { $limit: 30 },
          ],
          types: [
            {
              $group: {
                _id: '$type'
              }
            },
          ],
          tags: [
            {
              $project: {
                tags: 1,
              }
            },
            {
              $unwind: '$tags'
            },
            {
              $replaceRoot: { newRoot: '$tags' }
            },
            {
              $group: {
                _id: '$_id',
                label: { $first: '$label' },
              }
            }
          ],
          reactions: [
            {
              $unwind: '$category',
            },
            {
              $group: {
                _id: '$category._id',
                emoji: { $first: '$category.emoji' },
              }
            }
          ],
        }
      }
    ]);

    const filter_options = await this.postModel.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(query.user_id) },
      },
      {
        $facet: {
          types: [
            {
              $group: {
                _id: '$type',
              }
            },
            { $sort: { _id: 1 } }
          ],
          tags: [
            {
              $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags',
                pipeline : [
                  { $project : { label: 1 } }
                ],
              },
            },
            {
              $project: {
                tags: 1,
              }
            },
            {
              $unwind: '$tags'
            },
            {
              $replaceRoot: { newRoot: '$tags' }
            },
            {
              $group: {
                _id: '$_id',
                label: { $first: '$label' },
              }
            },
            { $sort: { _id: 1 } }
          ],
          reactions: [
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
                pipeline : [
                  { $project : { emoji: 1 } }
                ],
              },
            },
            {
              $unwind: '$category',
            },
            {
              $group: {
                _id: '$category._id',
                emoji: { $first: '$category.emoji' },
              }
            },
            { $sort: { _id: 1 } }
          ],
        }
      }
    ]);

    return {
      ...posts[0],
      pagination: posts[0].pagination[0],
      types: posts[0].types.map(t => t._id),
      filter_options: {
        ...filter_options[0],
        types: filter_options[0].types.map(t => t._id),
      },
    };
  }

  async findScheduled(user_id) {
    const date = DateService.dayjs();
    const scheduleQuery = {
      $gte: date.startOf('minute').toDate(),
    };

    try {
      return await this.postModel.find({
        user_id,
        scheduled_at: scheduleQuery,
      }).populate('user');
    } catch (error) {
      console.error(error);
    }
  }

  async findReminders(query) {
    try {
      return await this.postModel.find(query).populate('user');
    } catch (error) {
      console.error(error);
    }
  }

  async categories(query) {
    return await this.postModel.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(query.user_id) } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
          pipeline : [
            { $project : { emoji: 1 } }
          ],
        },
      },
      {
        $project: {
          id: { $first: '$category._id' },
          emoji: { $first: '$category.emoji' },
          created_at: { $first: '$category.created_at' },
        },
      },
      {
        $group: {
          _id: '$id',
          emoji: { $first: '$emoji' },
          created_at: { $first: '$created_at' },
          count: { $count: { } },
        }
      },
      { $match: { _id: { $ne: null } } },
      {
        $sort: { count: -1, created_at: 1 }
      },
    ]);
  }

  async dates(query) {
    return await this.postModel.aggregate([
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

  async create(post, data) {
    try {
      return await this.postModel.create(post);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async firstOrCreate(post) {
    try {
      let created = await this.postModel.findOne({
        whatsapp_id: post.whatsapp_id,
      });
      if ( !created ) {
        created = await this.postModel.create(post);
        created['is_new'] = true;
      }
      return created;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(userId, postId) {
    try {
      const response = await this.postModel.deleteOne({
        user_id: userId,
        _id: postId,
      });
      if ( !response.deletedCount ) throw new Error("Not found");
      return postId;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async update(id, data) {
    try {
      return await this.postModel.findByIdAndUpdate(
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
      return await this.postModel.updateMany(
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
      return await this.postModel.findOne(query);
    } catch (error) {
      console.error(error);
    }
  }
}
