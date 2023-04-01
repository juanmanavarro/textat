import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: false },
})
export class Category {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user_id;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  name;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  emoji;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.virtual('post_count', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'category',
  count: true,
});
