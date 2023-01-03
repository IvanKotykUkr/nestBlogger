import { InjectModel } from '@nestjs/mongoose';
import { Likes, LikesDocument } from './repository/likes.mongooose.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  ArrayIdType,
  ArrayLikesType,
  LikeDbType,
  LikeOrDislikeIdType,
  StatusLikeOrDislikeType,
} from '../comments.types';

@Injectable()
export class LikesRepositories {
  constructor(
    @InjectModel(Likes.name) private LikesModel: Model<LikesDocument>,
  ) {}

  async findStatus(
    userId: ObjectId,
    entityId: ObjectId,
  ): Promise<LikesDocument | boolean> {
    const like = await this.LikesModel.findOne({
      $and: [{ entityId }, { userId }],
    });
    if (like) return like;
    return false;
  }

  async save(like: LikesDocument) {
    await like.save();
    return;
  }

  async createStatus(likeDTO: LikeDbType) {
    const like = new this.LikesModel(likeDTO);
    await like.save();
    return;
  }

  async findLikesInDb(entityId: ArrayIdType): Promise<LikeOrDislikeIdType> {
    const comments = await this.LikesModel.find(
      { status: 'Like' },
      { _id: 0, entityId: 1 },
    ).lean();
    return comments;
  }

  async findDislikeInDb(entityId: ArrayIdType): Promise<LikeOrDislikeIdType> {
    return this.LikesModel.find(
      { status: 'Dislike' },
      { _id: 0, entityId: 1 },
    ).lean();
  }

  async findStatusArr(
    userId: ObjectId,
    entityId: ArrayIdType,
  ): Promise<StatusLikeOrDislikeType> {
    return this.LikesModel.find(
      { $and: [{ entityId }, { userId }] },
      { _id: 0, entityId: 1, status: 1 },
    ).lean();
  }

  async findLastLikes(entityId: ArrayIdType): Promise<ArrayLikesType> {
    return (
      this.LikesModel.find(
        { $and: [{ entityId }, { status: 'Like' }] },
        {
          _id: 0,
          entityId: 1,
          addedAt: 1,
          userId: 1,
          login: 1,
        },
      )
        .sort({ entityId: 1 })
        //   .sort({addedAt: -1})
        .lean()
    );
  }

  async deleteStatus(like: LikesDocument) {
    await like.deleteOne();
    return;
  }
}
