import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  BloggerResponseType,
  BloggerResponseTypeWithPagination,
  BloggerType,
} from '../types/bloggers.types';
import { InjectModel } from '@nestjs/mongoose';
import { BloggerDocument } from '../schema/mongoose.app.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class QueryBloggersRepositories {
  async;

  constructor(
    @InjectModel('bloggers') private BloggerModel: Model<BloggerDocument>,
  ) {}

  reqBlogger(blogger: BloggerType) {
    return {
      id: blogger._id,
      name: blogger.name,
      youtubeUrl: blogger.youtubeUrl,
    };
  }

  paginationFilter(name: string | null) {
    const filter = {};

    if (name) {
      return { name: { $regex: name } };
    }
    return filter;
  }

  async bloggersSearchCount(name: string | null): Promise<number> {
    const filter = this.paginationFilter(name);
    return this.BloggerModel.countDocuments(filter);
  }

  async getBloggers(
    name: string | null,
    size: number,
    number: number,
  ): Promise<BloggerResponseType[]> {
    const filter = await this.paginationFilter(name);

    const bloggers = await this.BloggerModel.find(filter)
      .skip(number > 0 ? (number - 1) * size : 0)
      .limit(size)
      .lean();

    return bloggers.map((d) => ({
      id: d._id,
      name: d.name,
      youtubeUrl: d.youtubeUrl,
    }));
  }

  async findBloggerById(_id: ObjectId): Promise<BloggerResponseType | string> {
    const blogger = await this.BloggerModel.findById(_id);
    if (blogger) {
      return this.reqBlogger(blogger);
    }
    return 'not found';
  }

  async findAllBloggers(
    searchnameterm: string | null,
    pagenumber: number,
    pagesize: number,
  ): Promise<BloggerResponseTypeWithPagination> {
    const page: number = pagenumber;
    const pageSize: number = pagesize;
    const totalCountSearch: number = await this.bloggersSearchCount(
      searchnameterm,
    );
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch: BloggerResponseType[] = await this.getBloggers(
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
}