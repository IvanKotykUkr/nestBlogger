import { BloggersHelper } from './bloggers.helper';
import { Injectable } from '@nestjs/common';
import { BloggerResponseType, BloggerType } from '../bloggers.types';
import { PostsResponseType } from '../../posts/posts.types';
import { PostsHelper } from '../../posts/application/posts.helper';
import { ObjectId } from 'mongodb';
import { BloggersRepositories } from '../infrastructure/bloggers.repositories';
import { PostsRepositories } from '../../posts/infrastructure/posts.repositories';

@Injectable()
export class BloggersService {
  constructor(
    protected bloggersHelper: BloggersHelper,
    protected postHelper: PostsHelper,
    protected bloggersRepositories: BloggersRepositories,
    protected postRepositories: PostsRepositories,
  ) {}

  async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
    const blogger = this.bloggersHelper.makeBlogger(name, youtubeUrl);
    return this.bloggersRepositories.createBlogger(blogger);
  }

  async updateBlogger(
    bloggerId: ObjectId,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    const newBlogger = this.bloggersHelper.updateBlogger(
      bloggerId,
      name,
      youtubeUrl,
    );
    return this.bloggersRepositories.updateBlogger(newBlogger);
  }

  async deleteBlogger(id: ObjectId): Promise<boolean> {
    return this.bloggersRepositories.deleteBlogger(id);
  }

  async createPosts(
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<PostsResponseType | string> {
    const blogger = await this.bloggersHelper.checkBlogger(id);
    if (typeof blogger === 'string') return 'not find blogger';
    const post = this.postHelper.makePost(
      title,
      shortDescription,
      content,
      blogger._id,
      blogger.name,
    );
    return this.postRepositories.createPost(post);
  }

  async findBloggerById(id: ObjectId): Promise<BloggerResponseType | string> {
    return this.bloggersRepositories.findBlogger(id);
  }
}
