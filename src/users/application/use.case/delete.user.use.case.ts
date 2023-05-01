import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UsersRepositories } from '../../infrastructure/users.repositories';
import { NotFoundException } from '@nestjs/common';
import { notFoundUser } from '../../../constants';

export class DeleteUserCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(protected usersRepositories: UsersRepositories) {}

  async execute(command: DeleteUserCommand) {
    const isDeleted = await this.usersRepositories.deleteUser(
      new ObjectId(command.id),
    );
    if (isDeleted === true) {
      return true;
    }

    throw new NotFoundException(notFoundUser);
  }
}
