import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { CUSTOM_MESSAGE } from '../decorators/message.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const customMessage = this.reflector.get(
      CUSTOM_MESSAGE,
      context.getHandler(),
    );
    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: customMessage,
          data,
        };
      }),
    );
  }
}
