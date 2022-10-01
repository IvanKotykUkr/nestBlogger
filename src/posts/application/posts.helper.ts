import { Injectable } from '@nestjs/common';
import { PostsRepositories } from '../infrastructure/posts.repositories';
import { PostsDBType, PostUpdatedType } from '../posts.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsHelper {
  constructor(protected postRepositories: PostsRepositories) {}

  makePost(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
    bloggerName: string,
  ): PostsDBType {
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

  updatePost(
    postId: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
    bloggerName: string,
  ): PostUpdatedType {
    const newPost: PostUpdatedType = {
      _id: postId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      bloggerId,
      bloggerName,
    };
    return newPost;
  }
}
