import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BloggerType } from '../types/bloggers.types';
import { InjectModel } from '@nestjs/mongoose';
import { BloggerDocument } from '../schema/mongoose.app.schema';
import { ObjectId } from 'mongodb';

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
    };
  }

  async createBlogger(newBlogger: BloggerType): Promise<BloggerType> {
    const bloggerInstance = new this.BloggerModel();
    bloggerInstance._id = newBlogger._id;
    bloggerInstance.name = newBlogger.name;
    bloggerInstance.youtubeUrl = newBlogger.youtubeUrl;

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

  async deleteBloggers(id: ObjectId): Promise<boolean> {
    const bloggerInstance = await this.BloggerModel.findById(id);
    if (!bloggerInstance) return false;

    await bloggerInstance.deleteOne();

    return true;
  }
}
