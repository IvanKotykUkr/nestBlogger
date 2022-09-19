import { BloggersRepositories } from './bloggers.repositories';
import { Injectable } from '@nestjs/common';
import { BloggerResponseType, BloggerType } from '../types/bloggers.types';
import { CheckBloggerType } from '../types/posts.types';
import { QueryBloggersRepositories } from './query.bloggers.repositories';
import { ObjectId } from 'mongodb';

@Injectable()
export class BloggersHelper {
  constructor(
    protected bloggersRepositories: BloggersRepositories,
    protected queryBloggersRepositories: QueryBloggersRepositories,
  ) {}

  async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
    const newBlogger: BloggerType = {
      _id: new ObjectId(),
      name,
      youtubeUrl,
    };

    return this.bloggersRepositories.createBlogger(newBlogger);
  }

  async updateBlogger(
    bloggerId: ObjectId,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    const newBlogger: BloggerType = {
      _id: bloggerId,
      name,
      youtubeUrl,
    };
    return this.bloggersRepositories.updateBlogger(newBlogger);
  }

  async deleteBlogger(id: ObjectId): Promise<boolean> {
    return this.bloggersRepositories.deleteBloggers(id);
  }

  async checkBlogger(bloggerId: ObjectId): Promise<CheckBloggerType | string> {
    const blogger: BloggerResponseType | string =
      await this.queryBloggersRepositories.findBloggerById(bloggerId);

    if (typeof blogger !== 'string') {
      return {
        _id: bloggerId,
        name: blogger.name,
      };
    }
    return 'not find blogger';
  }
}
