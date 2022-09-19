import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorsResponse = { errorsMessages: [] };
    const responseBody: any = exception.getResponse();
    responseBody.message.forEach((m) => errorsResponse.errorsMessages.push(m));
    response.status(status).json(errorsResponse);
    return;
  }
}
