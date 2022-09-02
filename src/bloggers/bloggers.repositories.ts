import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { BloggerResponseType, BloggerType } from '../types/bloggers,types';
import { InjectModel } from '@nestjs/mongoose';
import { BloggerDocument } from '../schema/mongoose.app.schema';

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

  async findBloggerInDb(id: mongoose.Types.ObjectId) {
    return id;
  }

  async createBlogger(newBlogger: BloggerType): Promise<BloggerType> {
    const bloggerInstance = new this.BloggerModel();
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

  async deleteBloggers(id: mongoose.Types.ObjectId): Promise<boolean> {
    const bloggerInstance = await this.BloggerModel.findById(id);
    if (!bloggerInstance) return false;

    await bloggerInstance.deleteOne();

    return true;
  }

  paginationFilter(name: string | null) {
    const filter = {};

    if (name) {
      return { name: { $regex: name } };
    }
    return filter;
  }

  async bloggersSearchCount(name: string | null): Promise<number> {
    const filter = this.paginationFilter(name);
    return this.BloggerModel.countDocuments(filter);
  }

  async getBloggers(
    name: string | null,
    size: number,
    number: number,
  ): Promise<BloggerResponseType[]> {
    const filter = await this.paginationFilter(name);

    const bloggers = await this.BloggerModel.find(filter)
      .skip(number > 0 ? (number - 1) * size : 0)
      .limit(size)
      .lean();

    return bloggers.map((d) => ({
      id: d._id,
      name: d.name,
      youtubeUrl: d.youtubeUrl,
    }));
  }

  async findBloggerById(
    id: mongoose.Types.ObjectId,
  ): Promise<BloggerResponseType | string> {
    const blogger = await this.BloggerModel.findById(id);

    if (blogger) {
      return this.reqBlogger(blogger);
    }
    return 'not found';
  }
}
