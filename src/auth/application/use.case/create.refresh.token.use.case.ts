import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { RefreshTokenPayload } from '../../auth.types';
import { JwtService } from '@nestjs/jwt';

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
  constructor(protected jwtService: JwtService) {}

  async execute(command: CreateRefreshTokenCommand) {
    const payload: RefreshTokenPayload = {
      userId: command.id,
      deviceId: command.deviceId,
      iat: +command.data,
    };
    const refresh = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: '2h',
    });
    return refresh;
  }
}
