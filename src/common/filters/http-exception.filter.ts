import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Catch(JsonWebTokenError, TokenExpiredError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status =
      exception instanceof JsonWebTokenError ||
      exception instanceof TokenExpiredError
        ? HttpStatus.UNAUTHORIZED
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof JsonWebTokenError ||
      exception instanceof TokenExpiredError
        ? 'Invalid token'
        : 'Internal server error';

    return response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
