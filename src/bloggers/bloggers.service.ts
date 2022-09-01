import { BloggersHelper } from './bloggers.helper';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { BloggerType } from '../types/bloggers,types';

@Injectable()
export class BloggersService {
  constructor(protected bloggersHelper: BloggersHelper) {}

  async getBlogger(id: ObjectId) {
    return this.bloggersHelper.findBlogger(id);
  }

  async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
    return this.bloggersHelper.createBlogger(name, youtubeUrl);
  }

  async updateBlogger(
    userId: ObjectId,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    return this.bloggersHelper.updateBlogger(userId, name, youtubeUrl);
  }

  async deleteBlogger(id: ObjectId): Promise<boolean> {
    return this.bloggersHelper.deleteBlogger(id);
  }

  async findAllBloggers(
    searchNameTerm: string,
    pageNumber: number,
    pageSize: number,
  ) {
    return this.bloggersHelper.getBloggers(
      searchNameTerm,
      pageNumber,
      pageSize,
    );
  }
}
