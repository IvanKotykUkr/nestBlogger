import { Injectable } from '@nestjs/common';
import { PostsRepositories } from './posts.repositories';
import {
  PostsDBType,
  PostsResponseType,
  PostsResponseTypeWithPagination,
  PostUpdatedType,
} from '../types/posts.types';
import mongoose, { ObjectId } from 'mongoose';

@Injectable()
export class PostsHelper {
  constructor(protected postRepositories: PostsRepositories) {}

  async findPost(id: ObjectId): Promise<PostsResponseType | string> {
    return this.postRepositories.findPostById(id);
  }

  async getAllPostsWithPagination(
    number: number,
    size: number,
    bloggerId?: mongoose.Types.ObjectId,
  ): Promise<PostsResponseTypeWithPagination> {
    const totalCount: number =
      await this.postRepositories.findPostsByIdBloggerCount(bloggerId);
    const page: number = number;
    const pageSize: number = size;
    const pagesCount: number = Math.ceil(totalCount / pageSize);
    const itemsFromDb: PostsDBType[] = await this.postRepositories.findAllPosts(
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

  async makePost(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: mongoose.Types.ObjectId,
    bloggerName: string,
  ) {
    const newPost: PostsDBType = {
      _id: new mongoose.Types.ObjectId(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      bloggerId,
      bloggerName,
      addedAt: new Date(),
    };
    return newPost;
  }

  async createPost(post: PostsDBType) {
    return this.postRepositories.createPost(post);
  }

  async updatePost(
    postId: mongoose.Types.ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: mongoose.Types.ObjectId,
    bloggerName: string,
  ): Promise<boolean | string> {
    const newPost: PostUpdatedType = {
      _id: postId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      bloggerId,
      bloggerName,
    };
    return this.postRepositories.updatePost(newPost);
  }

  async deletePost(postId: mongoose.Types.ObjectId): Promise<boolean | string> {
    return this.postRepositories.deletePost(postId);
  }
}
