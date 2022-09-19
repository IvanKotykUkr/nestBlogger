import { Injectable } from '@nestjs/common';
import { PostsRepositories } from './posts.repositories';
import { PostsDBType, PostUpdatedType } from '../types/posts.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsHelper {
  constructor(protected postRepositories: PostsRepositories) {}

  async makePost(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
    bloggerName: string,
  ) {
    const newPost: PostsDBType = {
      _id: new ObjectId(),
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
    postId: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
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

  async deletePost(postId: ObjectId): Promise<boolean | string> {
    return this.postRepositories.deletePost(postId);
  }
}
