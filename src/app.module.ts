import { Module } from '@nestjs/common';
import { BloggersController } from './bloggers/api/bloggers.controller';
import { BloggersService } from './bloggers/application/bloggers.service';
import { BloggersHelper } from './bloggers/application/bloggers.helper';
import { BloggersRepositories } from './bloggers/infrastructure/bloggers.repositories';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsHelper } from './posts/application/posts.helper';
import { PostsRepositories } from './posts/infrastructure/posts.repositories';
import { QueryBloggersRepositories } from './bloggers/infrastructure/query.bloggers.repositories';
import { QueryPostsRepositories } from './posts/infrastructure/query.posts.repositories';
import { UsersController } from './users/api/users.controller';
import { UsersHelper } from './users/application/users.helper';
import { UsersRepositories } from './users/infrastructure/users.repositories';
import { QueryUsersRepositories } from './users/infrastructure/query.users.repositories';
import { UsersService } from './users/application/users.service';
import { JwtService } from './auth/application/adapters/jwt.service';
import { AuthController } from './auth/api/auth.controller';
import { AuthService } from './auth/application/auth.service';
import { QueryCommentsRepositories } from './comments/infrastructure/query.comments.repositories';
import { CommentsController } from './comments/api/comments.controller.';
import { CommentsService } from './comments/application/comments.service';
import { CommentsHelper } from './comments/application/comments.helper';
import { CommentsRepositories } from './comments/infrastructure/comments.repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsSchema } from './comments/infrastructure/repository/comments.mongooose.schema';
import { GuardHelper } from './auth/application/adapters/guards/guard.helper';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailManager } from './auth/application/adapters/email.manager';
import { EmailAdapter } from './auth/application/adapters/email.adaptor';
import { DeleteTest } from './delete.test';
import { BloggerSchema } from './bloggers/infrastructure/repository/blogger.mongoose';
import { PostsSchema } from './posts/infrastructure/repository/posts.mongoose.schema';
import { UsersSchema } from './users/infrastructure/repository/users.mongoose.schema';
import { QueryBloggersController } from './bloggers/api/query.bloggers.controller';
import { QueryPostsController } from './posts/api/query.posts.controller';
import { QueryCommentsController } from './comments/api/query.comments.controller.';
import { QueryUsersController } from './users/api/query.users.controller';
import { ConfigModule } from '@nestjs/config';
import { TokesSchema } from './auth/infrastructure/repository/bedrefreshtoken.mongoose';
import { BedRefreshTokensRepositories } from './auth/infrastructure/bed-refresh-tokens-repositories';
import { LimitingSchema } from './auth/infrastructure/repository/rate.limiting.mongoose';
import { RateRecordRepositories } from './auth/infrastructure/rate-record-repositories';
import { AuthDevicesSchema } from './securitydevices/infrastructure/repository/auth.devices.sessions.mongoose';
import { SecurityDevicesController } from './securitydevices/api/security.devices.controller';
import { SecurityDevicesService } from './securitydevices/application/security.devices.service';
import { AuthDevicesRepositories } from './securitydevices/infrastructure/auth.devices.repositories';
import { QueryAuthDevicesRepositories } from './securitydevices/infrastructure/query.auth.devices.repositories';
import { DeviceGuards } from './securitydevices/application/adapters/guards/device.guards';
import { Validator } from 'class-validator';
import {
  Likes,
  LikesSchema,
} from './comments/infrastructure/repository/likes.mongooose.schema';
import { LikesRepositories } from './comments/infrastructure/likes.repositories';
import { LikesHelper } from './comments/application/likes.helper';
import { LikesAuthGuard } from './auth/application/adapters/guards/likes.auth.guard';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();
const controller = [
  BloggersController,
  PostsController,
  UsersController,
  AuthController,
  CommentsController,
  DeleteTest,
  SecurityDevicesController,
];
const queryController = [
  QueryBloggersController,
  QueryPostsController,
  QueryCommentsController,
  QueryUsersController,
];
const auth = [
  AuthService,
  BedRefreshTokensRepositories,
  RateRecordRepositories,
];
const user = [
  UsersService,
  UsersHelper,
  UsersRepositories,
  QueryUsersRepositories,
];
const post = [
  PostsService,
  PostsHelper,
  PostsRepositories,
  QueryPostsRepositories,
];
const comment = [
  CommentsService,
  CommentsHelper,
  CommentsRepositories,
  QueryCommentsRepositories,
];
const blogger = [
  BloggersService,
  BloggersHelper,
  BloggersRepositories,
  QueryBloggersRepositories,
];
const mongooseModule = [
  ConfigModule.forRoot(),
  MongooseModule.forRoot(
    // process.env.NODE_ENV === 'test'
    //'mongodb://localhost:27017',
    process.env.MONGO_URL,
  ),
  MongooseModule.forFeature([{ name: 'bloggers', schema: BloggerSchema }]),
  MongooseModule.forFeature([{ name: 'posts', schema: PostsSchema }]),
  MongooseModule.forFeature([{ name: 'users', schema: UsersSchema }]),
  MongooseModule.forFeature([{ name: 'comments', schema: CommentsSchema }]),
  MongooseModule.forFeature([{ name: 'tokens', schema: TokesSchema }]),
  MongooseModule.forFeature([{ name: 'rate record', schema: LimitingSchema }]),
  MongooseModule.forFeature([
    { name: 'auth devices', schema: AuthDevicesSchema },
  ]),
  MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
];

@Module({
  imports: [
    ...mongooseModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          ignoreTLS: true,
          secure: true,
          auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASS,
          },
        },
        defaults: {
          from: '"Kotyk" <backendkotyk@gmail.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [...controller, ...queryController],
  providers: [
    ...auth,
    ...blogger,
    ...post,
    ...comment,
    ...user,
    DeviceGuards,
    GuardHelper,
    JwtService,
    EmailManager,
    EmailAdapter,
    SecurityDevicesService,
    AuthDevicesRepositories,
    QueryAuthDevicesRepositories,
    LikesRepositories,
    Validator,
    LikesHelper,
    LikesAuthGuard,
  ],
})
export class AppModule {}
