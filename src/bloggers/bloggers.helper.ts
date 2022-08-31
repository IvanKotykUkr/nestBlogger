import { BloggersRepositories } from './bloggers.repositories';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';

@Injectable()
export class BloggersHelper {
  constructor(protected BloggersRepositories: BloggersRepositories) {}

  async findBlogger(id: ObjectId) {
    return this.BloggersRepositories.findBloggerInDb(id);
  }
}
