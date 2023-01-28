import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '../adapters/jwt.service';
import { ObjectId } from 'mongodb';

export class CreateRefreshTokenCommand {
  constructor(
    public id: ObjectId,
    public deviceId: string,
    public data: Date,
  ) {}
}

@CommandHandler(CreateRefreshTokenCommand)
export class CreateRefreshTokenUseCase
  implements ICommandHandler<CreateRefreshTokenCommand>
{
  return;

  constructor(protected jwtService: JwtService) {}

  async execute(command: CreateRefreshTokenCommand) {
    return this.jwtService.createRefreshToken(
      command.id,
      command.deviceId,
      command.data,
    );
  }
}
