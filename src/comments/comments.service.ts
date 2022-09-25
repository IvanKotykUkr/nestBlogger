import { CommentsHelper } from './comments.helper';
import { CommentsRepositories } from './comments.repositories';
import { ObjectId } from 'mongodb';
import { QueryPostsRepositories } from '../posts/query.posts.repositories';
import { Injectable } from '@nestjs/common';
import { CommentResponseType } from '../types/comments.types';

@Injectable()
export class CommentsService {
  constructor(
    protected queryPostsRepositories: QueryPostsRepositories,
    protected commentsHelper: CommentsHelper,
    protected commentsRepositories: CommentsRepositories,
  ) {}

  async createComment(
    id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
  ): Promise<CommentResponseType | string> {
    const post = await this.queryPostsRepositories.findPostById(id);
    if (typeof post === 'string') return post;

    const comment = this.commentsHelper.makeComment(
      id,
      content,
      userId,
      userLogin,
      post.id,
    );
    return this.commentsRepositories.createComment(comment);
  }

  async updateComment(id: ObjectId, content: string): Promise<boolean> {
    return this.commentsRepositories.updateComment(id, content);
  }

  async deleteComment(id: ObjectId): Promise<boolean> {
    return this.commentsRepositories.deleteComment(id);
  }
}
