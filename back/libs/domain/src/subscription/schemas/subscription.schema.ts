import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateService } from '@shared/services/date.service';
import mongoose, { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Subscription {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user_id;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
  })
  meta;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: null,
  })
  deleted_at;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

SubscriptionSchema.method('toResponse', function () {
  return {
    id                  : this.meta.id,
    status              : this.meta.status,
    ends_at             : DateService.unixToDate(this.meta.current_period_end),
    started_at          : DateService.unixToDate(this.meta.current_period_start),
    cancel_at_period_end: this.meta.cancel_at_period_end,
  }
});
