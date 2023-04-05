import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

export class CreateAccessTokenCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(CreateAccessTokenCommand)
export class CreateAccessTokenUseCase
  implements ICommandHandler<CreateAccessTokenCommand>
{
  constructor(protected jwtService: JwtService) {}

  async execute(command: CreateAccessTokenCommand) {
    if (!command.id) {
      throw new UnauthorizedException({
        message: 'Not have userId',
        field: 'userId',
      });
    }
    const payload = { sub: command.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
