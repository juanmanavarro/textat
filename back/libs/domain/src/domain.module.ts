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
import { PostService } from './post/post.service';
import { Post, PostSchema } from './post/schemas/post.schema';

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
      { name: Post.name, schema: PostSchema },
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
    PostService,
  ],
  exports: [
    UserService,
    AuthService,
    PostService,
  ],
})
export class DomainModule {}
