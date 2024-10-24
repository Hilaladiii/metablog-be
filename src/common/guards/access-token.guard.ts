import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from 'src/providers/token/token';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private tokenService: TokenService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const userData = this.tokenService.extractAndDecodedToken(request);
      if (userData.type !== 'access')
        throw new HttpException('Invalid token type', HttpStatus.UNAUTHORIZED);
      request.user = userData;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
