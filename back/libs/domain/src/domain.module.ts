import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import configuration from '../../../config';
import { AuthService } from './user/auth.service';
import { User, UserSchema } from './user/schemas/user.schema';
import { JwtStrategy } from './user/strategies/jwt.strategy';
import { UserService } from './user/user.service';
import { Message, MessageSchema } from './message/message.schema';
import { MessageService } from './message/message.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return configService.get('database');
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
        }
      },
      inject: [ConfigService]
    }),
    ConfigModule,
  ],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    MessageService,
  ],
  exports: [
    UserService,
    AuthService,
    MessageService,
  ],
})
export class DomainModule {}
