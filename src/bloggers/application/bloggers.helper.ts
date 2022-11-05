import { BloggersRepositories } from '../infrastructure/bloggers.repositories';
import { Injectable } from '@nestjs/common';
import { BloggerResponseType, BloggerType } from '../bloggers.types';
import { CheckBloggerType } from '../../posts/posts.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class BloggersHelper {
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  makeBlogger(name: string, youtubeUrl: string): BloggerType {
    const newBlogger: BloggerType = {
      _id: new ObjectId(),
      name,
      youtubeUrl,
      createdAt: new Date(),
    };

    return newBlogger;
  }

  updateBlogger(
    blogId: ObjectId,
    name: string,
    youtubeUrl: string,
  ): BloggerType {
    const newBlogger: BloggerType = {
      _id: blogId,
      name,
      youtubeUrl,
      createdAt: new Date(),
    };
    return newBlogger;
  }

  async checkBlogger(blogId: ObjectId): Promise<CheckBloggerType | string> {
    const blogger: BloggerResponseType | string =
      await this.bloggersRepositories.findBlogger(blogId);

    if (typeof blogger !== 'string') {
      return {
        _id: blogId,
        name: blogger.name,
      };
    }
    return 'not find blogger';
  }
}
