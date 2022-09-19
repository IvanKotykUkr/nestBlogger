import { Injectable } from '@nestjs/common';
import { PostsHelper } from './posts.helper';
import { PostsResponseType } from '../types/posts.types';
import { BloggersHelper } from '../bloggers/bloggers.helper';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsService {
  constructor(
    protected postsHelper: PostsHelper,
    protected bloggerHelper: BloggersHelper,
  ) {}

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
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
    postId: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
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

  async deletePost(postId: ObjectId): Promise<boolean | string> {
    return this.postsHelper.deletePost(postId);
  }
}
