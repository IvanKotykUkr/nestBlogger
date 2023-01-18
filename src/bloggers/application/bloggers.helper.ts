import { BloggersRepositories } from '../infrastructure/bloggers.repositories';
import { Injectable } from '@nestjs/common';
import { BloggerResponseType } from '../bloggers.types';
import { CheckBloggerType } from '../../posts/posts.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class BloggersHelper {
  constructor(protected bloggersRepositories: BloggersRepositories) {}

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
