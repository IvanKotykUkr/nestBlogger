import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {}

/*
@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const b64auth = (request.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');
    console.log(request.headers.authorization);
    if (
      b64auth === undefined ||
      username !== process.env.USERNAME ||
      password !== process.env.PASSWORD
    ) {
      throw new UnauthorizedException();
    }
    return true;
  }
}


 */
