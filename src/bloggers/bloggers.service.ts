import { BloggersHelper } from './bloggers.helper';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';

@Injectable()
export class BloggersService {
  constructor(protected BloggersHelper: BloggersHelper) {}

  async getBlogger(id: ObjectId) {
    return this.BloggersHelper.findBlogger(id);
  }
}
