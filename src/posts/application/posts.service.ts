import { Injectable } from '@nestjs/common';
import { PostsHelper } from './posts.helper';
import { BloggersHelper } from '../../bloggers/application/bloggers.helper';
import { ObjectId } from 'mongodb';
import { PostsRepositories } from '../infrastructure/posts.repositories';
import { LikesHelper } from '../../comments/application/likes.helper';

@Injectable()
export class PostsService {
  constructor(
    protected postsHelper: PostsHelper,
    protected bloggerHelper: BloggersHelper,
    protected postRepositories: PostsRepositories,
    protected likesHelper: LikesHelper,
  ) {}

  async updatePost(
    postId: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
  ): Promise<boolean | string> {
    const blogger = await this.bloggerHelper.checkBlogger(blogId);
    if (typeof blogger === 'string') return 'not find blogger';

    const newPost = this.postsHelper.updatePost(
      postId,
      title,
      shortDescription,
      content,
      blogId,
      blogger.name,
    );

    return this.postRepositories.updatePost(newPost);
  }

  async deletePost(postId: ObjectId): Promise<boolean | string> {
    return this.postRepositories.deletePost(postId);
  }

  async updateLikeStatus(
    id: ObjectId,
    likeStatus: string,
    userId: ObjectId,
    login: string,
  ) {
    const post = await this.postRepositories.findPostById(id);
    if (typeof post === 'string') return 'not found post';
    return this.likesHelper.createLikeStatus(id, likeStatus, userId, login);
  }
}
