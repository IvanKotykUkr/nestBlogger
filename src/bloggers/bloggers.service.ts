import { BloggersHelper } from './bloggers.helper';
import { Injectable } from '@nestjs/common';
import { BloggerType } from '../types/bloggers.types';
import { PostsResponseType } from '../types/posts.types';
import { PostsHelper } from '../posts/posts.helper';
import { ObjectId } from 'mongodb';

@Injectable()
export class BloggersService {
  constructor(
    protected bloggersHelper: BloggersHelper,
    protected postHelper: PostsHelper,
  ) {}

  async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
    return this.bloggersHelper.createBlogger(name, youtubeUrl);
  }

  async updateBlogger(
    bloggerId: ObjectId,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    return this.bloggersHelper.updateBlogger(bloggerId, name, youtubeUrl);
  }

  async deleteBlogger(id: ObjectId): Promise<boolean> {
    return this.bloggersHelper.deleteBlogger(id);
  }

  async createPosts(
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<PostsResponseType | string> {
    const blogger = await this.bloggersHelper.checkBlogger(id);
    if (typeof blogger === 'string') return 'not find blogger';
    const post = await this.postHelper.makePost(
      title,
      shortDescription,
      content,
      blogger._id,
      blogger.name,
    );
    return this.postHelper.createPost(post);
  }
}
