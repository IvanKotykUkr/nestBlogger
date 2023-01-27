import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ObjectId } from "mongodb";
import { UsersRepositories } from "../../infrastructure/users.repositories";

export class DeleteUserCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(protected usersRepositories: UsersRepositories) {}

  async execute(command: DeleteUserCommand) {
    return this.usersRepositories.deleteUser(command.id);
  }
}
