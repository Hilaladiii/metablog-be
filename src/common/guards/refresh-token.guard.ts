import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from 'src/providers/token/token';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { extractToken, isTokenExp, isTokenValid } from '../utils/token.utils';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private tokenService: TokenService,
    private prismaService: PrismaService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const token = extractToken(request);
      const userData = this.tokenService.extractAndDecodedToken(request);

      if (userData.type !== 'refresh' || isTokenExp(userData.exp))
        throw new HttpException('Invalid token!', HttpStatus.UNAUTHORIZED);

      const user = await this.prismaService.user.findUnique({
        where: {
          id: userData.sub,
        },
      });

      const isValid = isTokenValid(token, user.token);

      if (!isValid)
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

      request.user = userData;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
