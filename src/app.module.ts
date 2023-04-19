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
import { UsersHelper } from './users/application/users.helper';
import { UsersRepositories } from './users/infrastructure/users.repositories';
import { QueryUsersRepositories } from './users/infrastructure/query.users.repositories';
import { UsersService } from './users/application/users.service';
import { JwtServiceAuth } from './auth/application/adapters/jwt-service-auth.service';
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
import {
  User,
  UsersSchema,
} from './users/infrastructure/repository/users.mongoose.schema';
import { QueryBloggersController } from './bloggers/api/query.bloggers.controller';
import { QueryPostsController } from './posts/api/query.posts.controller';
import { QueryCommentsController } from './comments/api/query.comments.controller.';
import { ConfigModule } from '@nestjs/config';
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
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBloggerUseCase } from './bloggers/application/use.case/create.blogger.use.case';
import { DeleteBloggerUseCase } from './bloggers/application/use.case/delete.blogger.use.case';
import { UpdateBloggerUseCase } from './bloggers/application/use.case/update.blogger.use.case';
import { FindBloggerUseCase } from './bloggers/application/use.case/find.blogger.use.case';
import { CreatePostUseCase } from './posts/application/use.case/create.post.use.case';
import { UpdatePostUseCase } from './posts/application/use.case/update.post.use.case';
import { DeletePostUseCase } from './posts/application/use.case/delete.post.use.case';
import { FindPostUseCase } from './posts/application/use.case/find.post.use.case';
import { CreateCommentUseCase } from './comments/application/use.case/create.comment.use.case';
import { UpdateCommentUseCase } from './comments/application/use.case/update.comment.use.case';
import { DeleteCommentUseCase } from './comments/application/use.case/delete.comment.use.case';
import { FindCommentUseCase } from './comments/application/use.case/find.comment.use.case';
import { UpdateLikeUseCase } from './comments/application/use.case/update.like.use.case';
import { CreateUserUseCase } from './users/application/use.case/create.user.use.case';
import { DeleteUserUseCase } from './users/application/use.case/delete.user.use.case';
import { TokesSchema } from './auth/infrastructure/repository/bedrefreshtoken.mongoose';
import { ConfirmCodeUserUseCase } from './auth/application/use.case/confirm.code.user.use.case';
import { ResendConfirmCodeUserUseCase } from './auth/application/use.case/resend.confirm.code.user.use.case';
import { CreateAccessTokenUseCase } from './auth/application/use.case/create.access.token.use.case';
import { CreateRefreshTokenUseCase } from './auth/application/use.case/create.refresh.token.use.case';
import { AddDeviceUserUseCase } from './auth/application/use.case/addDeviceUserUseCase';
import { NewPasswordUserUseCase } from './auth/application/use.case/new.passsword.user.use.case';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import process from 'process';
import { LocalStrategy } from './auth/application/local.strategy';
import { JwtStrategy } from './auth/application/jwt.strategy';
import { ValidateUserUseCase } from './auth/application/use.case/login.use.case';
import { MeUseCase } from './auth/application/use.case/query.UseCase/meUseCase';
import { FindUserByIdUseCase } from './users/application/use.case/find.user.use.case';
import { LocalAuthGuard } from './auth/application/adapters/guards/local-auth.guard';
import { JwtAuthGuard } from './auth/application/adapters/guards/jwt-auth.guard';
import { SAController } from './sa/api/sa.controller';
import { FindAllUserUseCase } from './sa/application/useCase/queryUseCase/find.all.user.use.case';
import { BanUserUseCase } from './sa/application/useCase/ban.user.use.case';
import { UnBanUserUseCase } from './sa/application/useCase/unBan.user.use.case';
import { CheckOwnBlogGuard } from './auth/application/adapters/guards/autherisation-guard.service';
import { FindALLOwnedBlogsUseCase } from './bloggers/application/use.case/query.Use.Case/find.all.owned.blogs.use.case';
import { FindALLBlogsUseCase } from './bloggers/application/use.case/query.Use.Case/find.all.blogs.use.case';
import { FindAllPostsUseCase } from './bloggers/application/use.case/query.Use.Case/find.all.posts.use.case';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();
const controller = [
  BloggersController,
  PostsController,

  AuthController,
  CommentsController,
  DeleteTest,
  SecurityDevicesController,
  SAController,
];
const queryController = [
  QueryBloggersController,
  QueryPostsController,
  QueryCommentsController,
];
const auth = [
  AuthService,
  BedRefreshTokensRepositories,
  RateRecordRepositories,
  LocalStrategy,
  JwtStrategy,
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
const bloggerUseCase = [
  CreateBloggerUseCase,
  DeleteBloggerUseCase,
  UpdateBloggerUseCase,
  FindBloggerUseCase,
  FindALLOwnedBlogsUseCase,
  FindALLBlogsUseCase,
];
const postUseCase = [
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  FindPostUseCase,
  FindAllPostsUseCase,
];
const commentUseCase = [
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  FindCommentUseCase,
  UpdateLikeUseCase,
];
const userUserUseCase = [
  CreateUserUseCase,
  DeleteUserUseCase,
  FindUserByIdUseCase,
];
const authUseCase = [
  ConfirmCodeUserUseCase,
  ResendConfirmCodeUserUseCase,
  CreateAccessTokenUseCase,
  CreateRefreshTokenUseCase,
  AddDeviceUserUseCase,
  NewPasswordUserUseCase,
  ValidateUserUseCase,
  MeUseCase,
];
const saUseCase = [FindAllUserUseCase, BanUserUseCase, UnBanUserUseCase];
const mongooseModule = [
  ConfigModule.forRoot(),
  MongooseModule.forRoot(
    // process.env.NODE_ENV === 'test'
    //'mongodb://localhost:27017',
    process.env.MONGO_URL,
  ),
  MongooseModule.forFeature([{ name: 'bloggers', schema: BloggerSchema }]),
  MongooseModule.forFeature([{ name: 'posts', schema: PostsSchema }]),
  MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
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
    CqrsModule,
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
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [...controller, ...queryController],
  providers: [
    ...auth,
    ...blogger,
    ...post,
    ...comment,
    ...user,
    ...bloggerUseCase,
    ...postUseCase,
    ...commentUseCase,
    ...userUserUseCase,
    ...authUseCase,
    ...saUseCase,
    DeviceGuards,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    GuardHelper,
    JwtServiceAuth,
    EmailManager,
    EmailAdapter,
    SecurityDevicesService,
    AuthDevicesRepositories,
    QueryAuthDevicesRepositories,
    LikesRepositories,
    Validator,
    LikesHelper,
    LikesAuthGuard,
    CheckOwnBlogGuard,
  ],
})
export class AppModule {}
