import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BloggerResponseType, BloggerType } from '../bloggers.types';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { BloggerDocument } from './repository/blogger.mongoose';

@Injectable()
export class BloggersRepositories {
  constructor(
    @InjectModel('bloggers') private BloggerModel: Model<BloggerDocument>,
  ) {}

  reqBlogger(blogger: BloggerType) {
    return {
      id: blogger._id,
      name: blogger.name,
      youtubeUrl: blogger.youtubeUrl,
      createdAt: blogger.createdAt,
    };
  }

  async createBlogger(newBlogger: BloggerType): Promise<BloggerType> {
    const bloggerInstance = new this.BloggerModel();
    bloggerInstance._id = newBlogger._id;
    bloggerInstance.name = newBlogger.name;
    bloggerInstance.youtubeUrl = newBlogger.youtubeUrl;
    bloggerInstance.createdAt = newBlogger.createdAt;

    await bloggerInstance.save();
    return this.reqBlogger(bloggerInstance);
  }

  async updateBlogger(blogger: BloggerType): Promise<boolean> {
    const bloggerInstance = await this.BloggerModel.findById(blogger._id);
    if (!bloggerInstance) return false;
    bloggerInstance.name = blogger.name;
    bloggerInstance.youtubeUrl = blogger.youtubeUrl;
    await bloggerInstance.save();
    return true;
  }

  async deleteBlogger(id: ObjectId): Promise<boolean> {
    const bloggerInstance = await this.BloggerModel.findById(id);
    if (!bloggerInstance) return false;

    await bloggerInstance.deleteOne();

    return true;
  }

  async findBlogger(_id: ObjectId): Promise<BloggerResponseType | string> {
    const blogger = await this.BloggerModel.findById(_id);
    if (blogger) {
      return this.reqBlogger(blogger);
    }
    return 'not found';
  }
}
