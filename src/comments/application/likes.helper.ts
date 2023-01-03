import { Injectable } from '@nestjs/common';
import { LikesRepositories } from '../infrastructure/likes.repositories';
import { ObjectId } from 'mongodb';
import {
  ArrayCountIdType,
  ArrayIdType,
  ArrayLikesType,
  CommentsDBType,
  LikeDbType,
  LikeOrDislikeIdType,
  NewestThreeLikes,
  StatusLikeOrDislikeType,
} from '../comments.types';
import { LikesDocument } from '../infrastructure/repository/likes.mongooose.schema';
import { PostsDBType } from '../../posts/posts.types';

@Injectable()
export class LikesHelper {
  constructor(protected likesRepositories: LikesRepositories) {}

  async createLikeStatus(
    entityId: ObjectId,
    likeStatus: string,
    userId: ObjectId,
    login: string,
  ) {
    const checkStatus = await this.likesRepositories.findStatus(
      userId,
      entityId,
    );

    if (typeof checkStatus !== 'boolean') {
      return this.compareStatus(checkStatus, likeStatus);
    }
    const likeDTO = this.createLikeDTO(entityId, likeStatus, userId, login);
    return this.likesRepositories.createStatus(likeDTO);
  }

  takeEntityId(items: PostsDBType[] | CommentsDBType[]): ArrayIdType {
    return items.map((e: { _id: ObjectId }) => ({
      entityId: e._id.toString(),
    }));
  }

  countLikesOrDislikesFromArray(
    likesOrDislikesId: LikeOrDislikeIdType,
  ): ArrayCountIdType {
    const res = {};
    likesOrDislikesId.forEach((obj) => {
      const key: ObjectId = obj.entityId;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!res[key]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        res[key] = { ...obj, count: 0 };
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res[key].count += 1;
    });
    return Object.values(res);
  }

  findAmountLikeOrDislike(
    id: ObjectId,
    likesOrDislikesId: LikeOrDislikeIdType,
  ): number {
    const likesOrDislikes =
      this.countLikesOrDislikesFromArray(likesOrDislikesId);
    let amount = 0;

    for (let i = 0; i < likesOrDislikes.length; i++) {
      if (id.toString() === likesOrDislikes[i].entityId.toString()) {
        amount = likesOrDislikes[i].count;

        break;
      }
    }
    return amount;
  }

  findStatusInArray(
    entityId: ObjectId,
    allStatus: StatusLikeOrDislikeType,
  ): string {
    let status = 'None';
    for (let i = 0; i < allStatus.length; i++) {
      if (entityId.toString() === allStatus[i].entityId.toString()) {
        status = allStatus[i].status;
        break;
      }
    }
    return status;
  }

  groupAndSortLikes(likes: ArrayLikesType, id: ObjectId): NewestThreeLikes[] {
    const lastThreeLikes = [];
    for (let i = likes.length - 1; i >= 0; i--) {
      if (id.toString() === likes[i].entityId.toString()) {
        lastThreeLikes.push(likes[i]);
      }
      if (lastThreeLikes.length === 3) break;
    }

    return lastThreeLikes.map((d) => ({
      addedAt: d.addedAt,
      userId: d.userId,
      login: d.login,
    }));
  }

  async findLikes(id: ArrayIdType): Promise<LikeOrDislikeIdType> {
    return this.likesRepositories.findLikesInDb(id);
  }

  async findDislike(id: ArrayIdType): Promise<LikeOrDislikeIdType> {
    return this.likesRepositories.findDislikeInDb(id);
  }

  async findStatus(
    id: ObjectId,
    idItems: ArrayIdType,
  ): Promise<StatusLikeOrDislikeType> {
    /* if (id.toString() === '63ab296b882037600d1ce455') {
                                   return [];
                                 } else {
                             
                             
                                 */
    return this.likesRepositories.findStatusArr(id, idItems);
  }

  async findLastThreLikes(idItems: ArrayIdType): Promise<ArrayLikesType> {
    return this.likesRepositories.findLastLikes(idItems);
  }

  private createLikeDTO(
    entityId: ObjectId,
    status: string,
    userId: ObjectId,
    login: string,
  ): LikeDbType {
    return {
      _id: new ObjectId(),
      entityId,
      status,
      userId,
      login,
      addedAt: new Date(),
    };
  }

  private async compareStatus(like: LikesDocument, status: string) {
    if (status === 'None') {
      return this.likesRepositories.deleteStatus(like);
    }
    if (like.status.toString() === status) return;

    like.status = status;
    return this.likesRepositories.save(like);
  }
}
