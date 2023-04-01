import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Message {
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
  })
  type;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  text;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  data;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  scheduled_at;

  toReminder;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

MessageSchema.method('toReminder', function () {
  return this.text;
});