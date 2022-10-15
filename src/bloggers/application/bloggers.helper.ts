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
    bloggerId: ObjectId,
    name: string,
    youtubeUrl: string,
  ): BloggerType {
    const newBlogger: BloggerType = {
      _id: bloggerId,
      name,
      youtubeUrl,
      createdAt: new Date(),
    };
    return newBlogger;
  }

  async checkBlogger(bloggerId: ObjectId): Promise<CheckBloggerType | string> {
    const blogger: BloggerResponseType | string =
      await this.bloggersRepositories.findBlogger(bloggerId);

    if (typeof blogger !== 'string') {
      return {
        _id: bloggerId,
        name: blogger.name,
      };
    }
    return 'not find blogger';
  }
}
