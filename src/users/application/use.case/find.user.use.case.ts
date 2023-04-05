import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UsersRepositories } from '../../infrastructure/users.repositories';
import { UnauthorizedException } from '@nestjs/common';
import { UserRequestType } from '../../users.types';

export class FindUserByIdCommand {
  constructor(public userId: ObjectId) {}
}

@CommandHandler(FindUserByIdCommand)
export class FindUserByIdUseCase
  implements ICommandHandler<FindUserByIdCommand>
{
  constructor(protected usersRepositories: UsersRepositories) {}

  async execute(command: FindUserByIdCommand): Promise<UserRequestType> {
    const user = await this.usersRepositories.findUserById(
      new ObjectId(command.userId),
    );
    if (typeof user == 'string') {
      throw new UnauthorizedException([
        { message: 'there is no user', field: 'token' },
      ]);
    }
    return user;
  }
}
