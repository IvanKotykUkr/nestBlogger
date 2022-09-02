import { BloggersRepositories } from './bloggers.repositories';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import {
  BloggerResponseType,
  BloggerResponseTypeWithPagination,
  BloggerType,
} from '../types/bloggers,types';
import { CheckBloggerType } from '../types/posts.types';

@Injectable()
export class BloggersHelper {
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
    const newBlogger: BloggerType = {
      name,
      youtubeUrl,
    };

    return this.bloggersRepositories.createBlogger(newBlogger);
  }

  async updateBlogger(
    bloggerId: mongoose.Types.ObjectId,
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

  async deleteBlogger(id: mongoose.Types.ObjectId): Promise<boolean> {
    return this.bloggersRepositories.deleteBloggers(id);
  }

  async getBloggers(
    searchnameterm: string | null,
    pagenumber: number,
    pagesize: number,
  ): Promise<BloggerResponseTypeWithPagination> {
    const page: number = pagenumber;
    const pageSize: number = pagesize;
    const totalCountSearch: number =
      await this.bloggersRepositories.bloggersSearchCount(searchnameterm);
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch: BloggerResponseType[] =
      await this.bloggersRepositories.getBloggers(
        searchnameterm,
        pageSize,
        page,
      );

    return {
      pagesCount: pagesCountSearch,
      page,
      pageSize,
      totalCount: totalCountSearch,
      items: itemsSearch,
    };
  }

  async findBlogger(
    id: mongoose.Types.ObjectId,
  ): Promise<BloggerResponseType | string> {
    const blogger: BloggerResponseType | string =
      await this.bloggersRepositories.findBloggerById(id);
    if (blogger) {
      return blogger;
    }
    return null;
  }

  async checkBlogger(
    bloggerId: mongoose.Types.ObjectId,
  ): Promise<CheckBloggerType | string> {
    const blogger: BloggerResponseType | string =
      await this.bloggersRepositories.findBloggerById(bloggerId);

    if (typeof blogger !== 'string') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      return {
        _id: bloggerId,
        name: blogger.name,
      };
    }
    return 'not find blogger';
  }
}
