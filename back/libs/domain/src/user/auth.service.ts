import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { HasherService } from '@shared/services/hasher.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async getUserFromUsername(username) {
    return await this.userModel.findOne({ username });
  }

  validate(user, password) {
    if ( !user || !HasherService.compare(password, user.password) ) return null;

    const payload = { sub: user._id };
    return {
      ...user.toObject(),
      id: user._id.toString(),
      token: this.jwtService.sign(payload),
    };
  }

  async verify(token) {
    const data = this.jwtService.verify(token);
    return await this.userModel.findById(data.sub);
  }
}
