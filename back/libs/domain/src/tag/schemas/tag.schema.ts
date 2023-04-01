import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: false },
})
export class Tag {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user_id;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    lowercase: true,
  })
  label;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
