import { Module } from '@nestjs/common';
import { BloggersController } from './bloggers/bloggers.controller';
import { BloggersService } from './bloggers/bloggers.service';
import { BloggersHelper } from './bloggers/bloggers.helper';
import { BloggersRepositories } from './bloggers/bloggers.repositories';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BloggerSchema,
  PostsSchema,
  UsersSchema,
} from './schema/mongoose.app.schema';
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: 'bloggers', schema: BloggerSchema }]),
    MongooseModule.forFeature([{ name: 'posts', schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: 'users', schema: UsersSchema }]),
  ],
  controllers: [
    BloggersController,
    PostsController,
    UsersController,
    AuthController,
  ],
  providers: [
    BloggersService,
    BloggersHelper,
    BloggersRepositories,
    QueryBloggersRepositories,
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
  ],
})
export class AppModule {}
