import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { HasherService } from '@shared/services/hasher.service';

export type AdminDocument = Admin & Document;

@Schema({
  versionKey: false,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Admin {
  @Prop({
    type: mongoose.Schema.Types.String,
    lowercase: true,
  })
  email;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  name;

  @Prop({
    type: mongoose.Schema.Types.String,
    set: p => HasherService.hash(p),
  })
  password;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.method('toResponse', function () {
  return {
    id: this._id,
    email: this.email,
  }
});
