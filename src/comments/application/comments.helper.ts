import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { CommentsDBType } from '../comments.types';

@Injectable()
export class CommentsHelper {
  constructor() {}

  makeComment(
    id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    postId: ObjectId,
  ): CommentsDBType {
    return {
      _id: new ObjectId(),
      content,
      userId,
      userLogin,
      postId,
      addedAt: new Date(),
    };
  }
}
