import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostType } from 'apps/whatsapp-service/src/services/post-mapper.service';
import { DateService } from '@shared/services/date.service';

export type PostDocument = Post & Document;

@Schema({
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Post {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user_id;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  whatsapp_id;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  type;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  title;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  link;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  content;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  data;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  text;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  subtitle;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  image;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  category;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Tag',
  })
  tags;

  @Prop({
    type: [mongoose.Schema.Types.String],
  })
  comments;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  scheduled_at;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

PostSchema.virtual('message').get(function () {
  switch (this.type) {
    case 'link':
      return [
        `${this.title}` + (this.subtitle ? `| ${this.subtitle}` : ''),
        '',
        `${this.link}`,
        ...(this.text ? ['', `${this.text}`] : []),
      ].join('\n');
    case 'location':
      return [
        `${this.title}\n`,
        `${this.link}\n`,
      ].join('\n');
    case 'audio':
      return 'Nota de voz de ' + DateService.toFormat(this['created_at'], 'DD/MM/YYYY');
    default:
      return this.text;
  }
});

PostSchema.virtual('is_media').get(function () {
  return [
    PostType.AUDIO,
    PostType.DOCUMENT,
    PostType.IMAGE,
    PostType.LOCATION,
    PostType.VIDEO
  ].includes(this.type);
});
