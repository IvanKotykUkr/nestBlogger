import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokensDocument } from './repository/bedrefreshtoken.mongoose';

@Injectable()
export class BedRefreshTokensRepositories {
  constructor(
    @InjectModel('tokens') private TokensModel: Model<TokensDocument>,
  ) {}

  async saveBedToken(refreshToken: string) {
    const tokensModel = new this.TokensModel();
    tokensModel.token = refreshToken;
    tokensModel.addedAt = Date.now();
    await tokensModel.save();
    return;
  }

  async checkToken(refreshToken: string) {
    const token = await this.TokensModel.findOne({ token: refreshToken });
    if (token) {
      return 'bedToken';
    }
    return;
  }
}
