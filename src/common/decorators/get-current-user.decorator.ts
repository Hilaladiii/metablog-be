import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRPayload } from '../types/jwt.type';
import { extractToken } from '../utils/token.utils';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtRPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) {
      return request.headers;
    }
    const token = extractToken(request);
    return token;
  },
);
