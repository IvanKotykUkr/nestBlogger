import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';

@Injectable()
export class BloggersRepositories {
  async findBloggerInDb(id: ObjectId) {
    return id;
  }
}
