import { BloggersRepositories } from '../infrastructure/bloggers.repositories';
import { Injectable } from '@nestjs/common';
import {
  BloggerResponseType,
  BloggerType,
  BloggerTypeForUpdate,
} from '../bloggers.types';
import { CheckBloggerType } from '../../posts/posts.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class BloggersHelper {
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  makeBlogger(
    name: string,
    websiteUrl: string,
    description: string,
  ): BloggerType {
    const newBlogger: BloggerType = {
      _id: new ObjectId(),
      name,
      description,
      websiteUrl,
      createdAt: new Date(),
    };

    return newBlogger;
  }

  updateBlogger(
    blogId: ObjectId,
    name: string,
    websiteUrl: string,
    description: string,
  ): BloggerTypeForUpdate {
    const newBlogger: BloggerType = {
      _id: blogId,
      name,
      description,
      websiteUrl,
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
