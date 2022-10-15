import { Controller, Delete } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BloggerDocument } from './bloggers/infrastructure/repository/blogger.mongoose';
import { CommentsDocument } from './comments/infrastructure/repository/comments.mongooose.schema';
import { PostsDocument } from './posts/infrastructure/repository/posts.mongoose.schema';
import { UsersDocument } from './users/infrastructure/repository/users.mongoose.schema';

@Controller('/testing')
export class DeleteTest {
  constructor(
    @InjectModel('bloggers') private BloggerModel: Model<BloggerDocument>,
    @InjectModel('comments') private CommentsModel: Model<CommentsDocument>,
    @InjectModel('posts') private PostModel: Model<PostsDocument>,
    @InjectModel('users') private UsersModel: Model<UsersDocument>,
  ) {}

  @Delete('/all-data')
  async deleteAllData(): Promise<void> {
    await this.BloggerModel.deleteMany();
    await this.CommentsModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.UsersModel.deleteMany();

    return;
  }
}
