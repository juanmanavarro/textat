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
import { TagService } from './tag/tag.service';
import { Tag, TagSchema } from './tag/schemas/tag.schema';
import { Category, CategorySchema } from './category/schemas/category.schema';
import { CategoryService } from './category/category.service';
import { Subscription } from 'rxjs';
import { SubscriptionSchema } from './subscription/schemas/subscription.schema';
import { SubscriptionRepository } from './subscription/subscription.repository';
import { Admin, AdminSchema } from './user/schemas/admin.schema';
import { AdminService } from './user/admin.service';
import { ContactService } from './contact/contact.service';
import { Contact, ContactSchema } from './contact/schemas/contact.schema';

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
      { name: Tag.name, schema: TagSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Contact.name, schema: ContactSchema },
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
    TagService,
    CategoryService,
    SubscriptionRepository,
    AdminService,
    ContactService,
  ],
  exports: [
    UserService,
    AuthService,
    PostService,
    TagService,
    CategoryService,
    SubscriptionRepository,
    AdminService,
    ContactService,
  ],
})
export class DomainModule {}
