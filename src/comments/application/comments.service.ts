import { CommentsHelper } from './comments.helper';
import { CommentsRepositories } from '../infrastructure/comments.repositories';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { CommentResponseType } from '../comments.types';
import { PostsRepositories } from '../../posts/infrastructure/posts.repositories';
import { LikesHelper } from './likes.helper';

@Injectable()
export class CommentsService {
  constructor(
    protected postsRepositories: PostsRepositories,
    protected commentsHelper: CommentsHelper,
    protected commentsRepositories: CommentsRepositories,
    protected likesHelper: LikesHelper,
  ) {}

  async createComment(
    id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
  ): Promise<CommentResponseType | string> {
    const post = await this.postsRepositories.findPostById(id);
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

  async updateLikeStatus(
    id: ObjectId,
    likeStatus: string,
    userId: ObjectId,
    login: string,
  ) {
    const comment = await this.commentsRepositories.findCommentsById(id);
    if (typeof comment === 'string') return 'doesnt exists';
    return this.likesHelper.createLikeStatus(id, likeStatus, userId, login);
  }
}
