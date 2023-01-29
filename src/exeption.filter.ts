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
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseBody: any = exception.getResponse();
    if (status === 400) {
      const errorsResponse = { errorsMessages: [] };
      responseBody.message.forEach(m => errorsResponse.errorsMessages.push(m));
      response.status(status).json(errorsResponse);
    } else {
      /* if (status === 401) {
                         const errorsResponse = { errorsMessages: [] };
                         responseBody.message.forEach((m) =>
                           errorsResponse.errorsMessages.push(m),
                         );
                         response.status(status).json(errorsResponse);
                       }
                        */
      response
        .status(status)
        .send({ message: responseBody.message, field: responseBody.field });
    }
  }
}
