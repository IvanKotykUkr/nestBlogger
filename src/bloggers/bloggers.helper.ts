import { BloggersRepositories } from './bloggers.repositories';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import {
  BloggerResponseType,
  BloggerResponseTypeWithPagination,
  BloggerType,
} from '../types/bloggers,types';

@Injectable()
export class BloggersHelper {
  constructor(protected BloggersRepositories: BloggersRepositories) {}

  async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
    const newBlogger: BloggerType = {
      name,
      youtubeUrl,
    };

    return this.BloggersRepositories.createBlogger(newBlogger);
  }

  async updateBlogger(
    userId: ObjectId,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    const newBlogger: BloggerType = {
      _id: userId,
      name,
      youtubeUrl,
    };
    return this.BloggersRepositories.updateBlogger(newBlogger);
  }

  async deleteBlogger(id: ObjectId): Promise<boolean> {
    return this.BloggersRepositories.deleteBloggers(id);
  }

  async getBloggers(
    searchnameterm: string | null,
    pagenumber: number,
    pagesize: number,
  ): Promise<BloggerResponseTypeWithPagination> {
    const page: number = pagenumber;
    const pageSize: number = pagesize;
    const totalCountSearch: number =
      await this.BloggersRepositories.bloggersSearchCount(searchnameterm);
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch: BloggerResponseType[] =
      await this.BloggersRepositories.getBloggers(
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

  async findBlogger(id: ObjectId): Promise<BloggerResponseType | string> {
    const blogger: BloggerResponseType | string =
      await this.BloggersRepositories.findBloggerById(id);
    if (blogger) {
      return blogger;
    }
    return null;
  }
}
