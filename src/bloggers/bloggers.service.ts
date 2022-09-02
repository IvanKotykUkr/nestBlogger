import { BloggersHelper } from './bloggers.helper';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { BloggerType } from '../types/bloggers,types';
import {
  PostsResponseType,
  PostsResponseTypeWithPagination,
} from '../types/posts.types';
import { PostsHelper } from '../posts/posts.helper';

@Injectable()
export class BloggersService {
  constructor(
    protected bloggersHelper: BloggersHelper,
    protected postHelper: PostsHelper,
  ) {}

  async getBlogger(id: mongoose.Types.ObjectId) {
    return this.bloggersHelper.findBlogger(id);
  }

  async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
    return this.bloggersHelper.createBlogger(name, youtubeUrl);
  }

  async updateBlogger(
    bloggerId: mongoose.Types.ObjectId,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    return this.bloggersHelper.updateBlogger(bloggerId, name, youtubeUrl);
  }

  async deleteBlogger(id: mongoose.Types.ObjectId): Promise<boolean> {
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

  async getPostsByBloggerId(
    id: mongoose.Types.ObjectId,
    PageNumber: number,
    PageSize: number,
  ): Promise<PostsResponseTypeWithPagination | string> {
    const blogger = await this.bloggersHelper.checkBlogger(id);
    if (typeof blogger === 'string') return 'not find blogger';

    const post = await this.postHelper.getAllPostsWithPagination(
      PageNumber,
      PageSize,
      blogger._id,
    );
    return post;
  }

  async createPosts(
    id: mongoose.Types.ObjectId,
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
