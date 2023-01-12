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
    blogName: string,
  ): PostsDBType {
    const newPost: PostsDBType = {
      _id: new ObjectId(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId,
      blogName,
      createdAt: new Date(),
    };
    return newPost;
  }

  updatePost(
    postId: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
  ): PostUpdatedType {
    const newPost: PostUpdatedType = {
      _id: postId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId,
      blogName,
    };
    return newPost;
  }
}
