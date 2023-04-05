/*import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      const payload = await this.jwtService.verifyAsync(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['userId'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request) {
      throw new UnauthorizedException([
        {
          message: 'there are no authorizations in the header ',
          field: 'headers authorization',
        },
      ]);
    }
    const token: string = request.split(' ')[1];
    try {
      console.log('token ' + token);
      const payload = this.jwtService.verify(token);
      console.log(payload);
      req.userId = payload.userId;
    } catch {
      throw new UnauthorizedException({
        message: 'Should be valide JWT Token',
        field: 'token',
      });
    }
  }
}


 */
