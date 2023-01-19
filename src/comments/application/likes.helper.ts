import { Injectable } from '@nestjs/common';
import { LikesRepositories } from '../infrastructure/likes.repositories';
import { ObjectId } from 'mongodb';
import {
  ArrayCountIdType,
  ArrayIdType,
  ArrayLikesType,
  CommentsDBType,
  LikeOrDislikeIdType,
  NewestThreeLikes,
  StatusLikeOrDislikeType,
} from '../comments.types';
import { PostsDBType } from '../../posts/posts.types';

@Injectable()
export class LikesHelper {
  constructor(protected likesRepositories: LikesRepositories) {}

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
    return this.likesRepositories.findStatusArr(id, idItems);
  }

  async findLastThreLikes(idItems: ArrayIdType): Promise<ArrayLikesType> {
    return this.likesRepositories.findLastLikes(idItems);
  }
}
