import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateUserCommand } from './use.case/login.use.case';
import { ObjectId } from 'mongodb';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(protected commandBus: CommandBus) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(username: string, password: string): Promise<ObjectId> {
    const userId = await this.commandBus.execute(
      new ValidateUserCommand(username, password),
    );
    if (!userId) {
      throw new UnauthorizedException();
    }
    return userId;
  }
}
