import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async login(data: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!user)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    const isPasswordValid = await argon2.verify(user.password, data.password);

    if (!isPasswordValid)
      throw new HttpException(
        'Username or Password invalid!',
        HttpStatus.BAD_REQUEST,
      );

    const token = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, token.refreshToken);
    return token;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        token: hashedRefreshToken,
      },
    });
  }

  async getTokens(userId: string, username: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
          type: 'access',
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
          type: 'refresh',
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string, token: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user.token) throw new ForbiddenException();

    const isValid = await argon2.verify(user.token, token);
    if (!isValid) throw new UnauthorizedException();

    const tokens = await this.getTokens(userId, user.username, user.role);
    await this.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        token: null,
      },
    });
  }
}
