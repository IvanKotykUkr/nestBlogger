import { Controller, Delete, HttpCode } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BloggerDocument } from './bloggers/infrastructure/repository/blogger.mongoose';
import { CommentsDocument } from './comments/infrastructure/repository/comments.mongooose.schema';
import { PostsDocument } from './posts/infrastructure/repository/posts.mongoose.schema';
import { UsersDocument } from './users/infrastructure/repository/users.mongoose.schema';
import { DevicesDocument } from './securitydevices/infrastructure/repository/auth.devices.sessions.mongoose';
import {
  Likes,
  LikesDocument,
} from './comments/infrastructure/repository/likes.mongooose.schema';

@Controller('/testing')
export class DeleteTest {
  constructor(
    @InjectModel('bloggers') private BloggerModel: Model<BloggerDocument>,
    @InjectModel('comments') private CommentsModel: Model<CommentsDocument>,
    @InjectModel('posts') private PostModel: Model<PostsDocument>,
    @InjectModel('users') private UsersModel: Model<UsersDocument>,
    @InjectModel('auth devices')
    private AuthDevicesModel: Model<DevicesDocument>,
    @InjectModel(Likes.name) private LikesModel: Model<LikesDocument>,
  ) {}

  @Delete('/all-data')
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.BloggerModel.deleteMany();
    await this.CommentsModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.UsersModel.deleteMany();
    await this.AuthDevicesModel.deleteMany();
    await this.LikesModel.deleteMany();

    return;
  }
}
