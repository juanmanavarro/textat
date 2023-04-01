import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { HasherService } from '@shared/services/hasher.service';
import { CrypterService } from '@shared/services/crypter.service';
import { TimezoneService } from '@shared/services/timezone.service';

export type UserDocument = User & Document;

@Schema({
  versionKey: false,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class User {
  /**
   * to send ws messages
   */
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  })
  phone;

  /**
   * bot id
   */
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  })
  whatsapp_id;

  @Prop({
    type: mongoose.Schema.Types.String,
    lowercase: true,
  })
  username;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  name;

  @Prop({
    type: mongoose.Schema.Types.String,
    set: p => HasherService.hash(p),
  })
  password;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: new Date,
  })
  registered_at;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'Etc/GMT',
  })
  timezone;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripe_id;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  language;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('subscription', {
  ref: 'Subscription',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true,
  options: {
    match: { deleted_at: null },
  },
});

UserSchema.virtual('contacts', {
  ref: 'Contact',
  localField: '_id',
  foreignField: 'user_id',
  options: { sort: { 'created_at': -1 } },
});

UserSchema.virtual('subscribed').get(function() {
  return this['subscription']
    ? this['subscription']?.meta.status !== 'canceled'
    : false;
});

UserSchema.pre('save', async function (next) {
  if ( this.password || this.language ) return next();
  try {
    if ( this.whatsapp_id ) {
      this.timezone = TimezoneService.fromPhone(this.whatsapp_id);
      this.phone = CrypterService.encrypt(this.whatsapp_id);
      this.whatsapp_id = HasherService.hash(this.whatsapp_id);
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.method('toResponse', function () {
  return {
    id: this._id,
    username: this.username,
    registered_at: this.registered_at,
  }
});
