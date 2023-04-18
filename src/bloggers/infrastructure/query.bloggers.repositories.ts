import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  BloggerResponseType,
  BloggerType,
  BloggSearchFilerType,
} from '../bloggers.types';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { BloggerDocument } from './repository/blogger.mongoose';

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
      description: blogger.description,
      websiteUrl: blogger.websiteUrl,
      createdAt: blogger.createdAt,
      isMembership: true,
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
    filter: BloggSearchFilerType,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    page: number,
  ): Promise<BloggerResponseType[]> {
    const direction = this.getDirection(sortDirection);
    const bloggers = await this.BloggerModel.find(filter)
      .skip(page > 0 ? (page - 1) * pageSize : 0)
      .sort({ [sortBy]: direction })
      .limit(pageSize)
      .lean();
    return bloggers.map((d) => ({
      id: d._id,
      name: d.name,
      description: d.description,
      websiteUrl: d.websiteUrl,
      createdAt: d.createdAt,
      isMembership: true,
    }));
  }

  async findBloggerById(_id: ObjectId): Promise<BloggerResponseType | string> {
    const blogger = await this.BloggerModel.findById({ _id: _id });

    if (blogger) {
      return this.reqBlogger(blogger);
    }
    return 'not found';
  }

  async bloggSearchCount(filter: BloggSearchFilerType) {
    return 0;
  }

  private getDirection(sortDirection: string) {
    if (sortDirection.toString() === 'asc') {
      return 1;
    }
    if (sortDirection.toString() === 'desc') {
      return -1;
    }
  }
}
