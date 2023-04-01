import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: false },
})
export class Contact {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user_id;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  message;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  admin_id;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  response;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  answered_at;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

ContactSchema.virtual('admin', {
  ref: 'Admin',
  localField: 'admin_id',
  foreignField: '_id',
  justOne: true,
});
