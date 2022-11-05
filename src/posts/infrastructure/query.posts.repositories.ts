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
      blogId: post.blogId,
      bloggerName: post.bloggerName,
      addedAt: post.addedAt,
    };
  }

  async findPostById(_id: ObjectId): Promise<PostsResponseType | string> {
    const post = await this.PostModel.findById(_id);
    if (post) {
      return this.resPost(post);
    }
    return 'not found';
  }

  paginationFilter(blogId: undefined | ObjectId) {
    const filter = {};
    if (blogId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      return { blogId };
    }
    return filter;
  }

  async findPostsByIdBloggerCount(
    blogId: undefined | ObjectId,
  ): Promise<number> {
    const filter = this.paginationFilter(blogId);

    return this.PostModel.countDocuments(filter);
  }

  async findAllPosts(
    blogId: undefined | ObjectId,
    number: number,
    size: number,
  ): Promise<PostsDBType[]> {
    const filter = await this.paginationFilter(blogId);

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
    blogId?: ObjectId,
  ): Promise<PostsResponseTypeWithPagination> {
    const totalCount: number = await this.findPostsByIdBloggerCount(blogId);
    const page: number = number;
    const pageSize: number = size;
    const pagesCount: number = Math.ceil(totalCount / pageSize);
    const itemsFromDb: PostsDBType[] = await this.findAllPosts(
      blogId,
      page,
      pageSize,
    );

    const items = itemsFromDb.map((p) => ({
      id: p._id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
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
