import { Injectable } from '@nestjs/common';
import { PostsDBType, PostUpdatedType } from '../posts.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsHelper {
  makePost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    bloggerName: string,
  ): PostsDBType {
    const newPost: PostsDBType = {
      _id: new ObjectId(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId,
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
    blogId: ObjectId,
    bloggerName: string,
  ): PostUpdatedType {
    const newPost: PostUpdatedType = {
      _id: postId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId,
      bloggerName,
    };
    return newPost;
  }
}
