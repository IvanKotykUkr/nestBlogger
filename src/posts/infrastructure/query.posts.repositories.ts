import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostsDBType,
  PostsResponseType,
  PostsResponseTypeWithPagination,
} from '../posts.types';
import { ObjectId } from 'mongodb';
import { PostsDocument } from './repository/posts.mongoose.schema';

@Injectable()
export class QueryPostsRepositories {
  constructor(@InjectModel('posts') private PostModel: Model<PostsDocument>) {}

  resPost(post: PostsDBType): PostsResponseType {
    return {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      bloggerName: post.bloggerName,
      addedAt: post.addedAt,
    };
  }

  async findPostById(id: ObjectId): Promise<PostsResponseType | string> {
    const post = await this.PostModel.findById(id);
    if (post) {
      return this.resPost(post);
    }
    return 'not found';
  }

  async paginationFilter(bloggerId: undefined | ObjectId) {
    const filter = {};
    if (bloggerId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      return { bloggerId };
    }
    return filter;
  }

  async findPostsByIdBloggerCount(
    bloggerId: undefined | ObjectId,
  ): Promise<number> {
    const filter = await this.paginationFilter(bloggerId);

    return this.PostModel.countDocuments(filter);
  }

  async findAllPosts(
    bloggerId: undefined | ObjectId,
    number: number,
    size: number,
  ): Promise<PostsDBType[]> {
    const filter = await this.paginationFilter(bloggerId);

    return (
      this.PostModel.find(filter)
        //.skip((number - 1) * size)
        .skip(number > 0 ? (number - 1) * size : 0)
        .limit(size)
        .lean()
    );
  }

  async getAllPostsWithPagination(
    number: number,
    size: number,
    bloggerId?: ObjectId,
  ): Promise<PostsResponseTypeWithPagination> {
    const totalCount: number = await this.findPostsByIdBloggerCount(bloggerId);
    const page: number = number;
    const pageSize: number = size;
    const pagesCount: number = Math.ceil(totalCount / pageSize);
    const itemsFromDb: PostsDBType[] = await this.findAllPosts(
      bloggerId,
      page,
      pageSize,
    );

    const items = itemsFromDb.map((p) => ({
      id: p._id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      bloggerId: p.bloggerId,
      bloggerName: p.bloggerName,
      addedAt: p.addedAt,
    }));
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items,
    };
  }
}
