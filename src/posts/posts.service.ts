import { Injectable } from '@nestjs/common';
import { PostsHelper } from './posts.helper';
import mongoose, { ObjectId } from 'mongoose';
import {
  PostsResponseType,
  PostsResponseTypeWithPagination,
} from '../types/posts.types';
import { BloggersHelper } from '../bloggers/bloggers.helper';

@Injectable()
export class PostsService {
  constructor(
    protected postsHelper: PostsHelper,
    protected bloggerHelper: BloggersHelper,
  ) {}

  async getPost(id: ObjectId): Promise<PostsResponseType | string> {
    return this.postsHelper.findPost(id);
  }

  async getPosts(
    pageNumber: number,
    pageSize: number,
  ): Promise<PostsResponseTypeWithPagination> {
    return this.postsHelper.getAllPostsWithPagination(pageNumber, pageSize);
  }

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: mongoose.Types.ObjectId,
  ): Promise<PostsResponseType | string> {
    const blogger = await this.bloggerHelper.checkBlogger(bloggerId);
    if (typeof blogger === 'string') return 'not find blogger';
    const madePost = await this.postsHelper.makePost(
      title,
      shortDescription,
      content,
      blogger._id,
      blogger.name,
    );

    const post: PostsResponseType = await this.postsHelper.createPost(madePost);
    return post;
    //return this.postsHelper.makePostResponse(post);
  }

  async updatePost(
    postId: mongoose.Types.ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: mongoose.Types.ObjectId,
  ): Promise<boolean | string> {
    const blogger = await this.bloggerHelper.checkBlogger(bloggerId);
    if (typeof blogger === 'string') return 'not find blogger';

    const newPost = await this.postsHelper.updatePost(
      postId,
      title,
      shortDescription,
      content,
      bloggerId,
      blogger.name,
    );
    return newPost;
  }

  async deletePost(postId: mongoose.Types.ObjectId): Promise<boolean | string> {
    return this.postsHelper.deletePost(postId);
  }
}
