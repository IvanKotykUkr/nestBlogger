import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { QueryUsersRepositories } from '../../../../users/infrastructure/query.users.repositories';
import { UnauthorizedException } from '@nestjs/common';

export class MeCommand {
  constructor(public id: ObjectId) {}
}

@QueryHandler(MeCommand)
export class MeUseCase implements IQueryHandler<MeCommand> {
  constructor(protected queryUsersRepositories: QueryUsersRepositories) {}

  async execute(command: MeCommand) {
    const user = await this.queryUsersRepositories.findUserById(
      new ObjectId(command.id),
    );
    if (!user) {
      throw new UnauthorizedException([
        { message: 'there is no user', field: 'token' },
      ]);
    }

    return {
      email: user.accountData.email,
      login: user.accountData.login,
      userId: user._id,
    };
  }
}
