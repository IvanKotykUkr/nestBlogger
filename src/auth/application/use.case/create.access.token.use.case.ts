import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '../adapters/jwt.service';
import { ObjectId } from 'mongodb';

export class CreateAccessTokenCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(CreateAccessTokenCommand)
export class CreateAccessTokenUseCase
  implements ICommandHandler<CreateAccessTokenCommand>
{
  return;

  constructor(protected jwtService: JwtService) {}

  async execute(command: CreateAccessTokenCommand) {
    return this.jwtService.createAccessToken(command.id);
  }
}
