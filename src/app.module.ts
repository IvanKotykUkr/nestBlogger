import { Module } from '@nestjs/common';
import { BloggersController } from './bloggers/bloggers.controller';
import { BloggersService } from './bloggers/bloggers.service';
import { BloggersHelper } from './bloggers/bloggers.helper';
import { BloggersRepositories } from './bloggers/bloggers.repositories';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsHelper } from './posts/posts.helper';
import { PostsRepositories } from './posts/posts.repositories';
import { QueryBloggersRepositories } from './bloggers/query.bloggers.repositories';
import { QueryPostsRepositories } from './posts/query.posts.repositories';
import { UsersController } from './users/users.controller';
import { UsersHelper } from './users/users.helper';
import { UsersRepositories } from './users/users.repositories';
import { QueryUsersRepositories } from './users/query.users.repositories';
import { UsersService } from './users/users.service';
import { JwtService } from './jwt.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { QueryCommentsRepositories } from './comments/query.comments.repositories';
import { CommentsController } from './comments/comments.controller.';
import { CommentsService } from './comments/comments.service';
import { CommentsHelper } from './comments/comments.helper';
import { CommentsRepositories } from './comments/comments.repositories';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BloggerSchema,
  CommentsSchema,
  PostsSchema,
  UsersSchema,
} from './schema/mongoose.app.schema';
import { GuardHelper } from './guard.helper';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailManager } from './users/email.manager';
import { EmailAdapter } from './email.adaptor';
import { DeleteTest } from './delete.test';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: 'bloggers', schema: BloggerSchema }]),
    MongooseModule.forFeature([{ name: 'posts', schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: 'users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'comments', schema: CommentsSchema }]),
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
  controllers: [
    BloggersController,
    PostsController,
    UsersController,
    AuthController,
    CommentsController,
    DeleteTest,
  ],
  providers: [
    BloggersService,
    BloggersHelper,
    BloggersRepositories,
    QueryBloggersRepositories,
    GuardHelper,
    PostsService,
    PostsHelper,
    PostsRepositories,
    QueryPostsRepositories,
    UsersService,
    UsersHelper,
    UsersRepositories,
    QueryUsersRepositories,
    AuthService,
    JwtService,
    CommentsService,
    CommentsHelper,
    CommentsRepositories,
    QueryCommentsRepositories,
    EmailManager,
    EmailAdapter,
  ],
})
export class AppModule {}
