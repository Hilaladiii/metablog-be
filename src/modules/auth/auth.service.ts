import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  @Post()
  async login(data: AuthDto) {
    const user = await this.userService.findByUsername(data.username);

    if (!user)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    const isPasswordValid = await bcryptjs.compare(
      data.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new HttpException(
        'Username or Password invalid!',
        HttpStatus.BAD_REQUEST,
      );

    const token = await this.getTokens(user.id, user.username, user.role);
    console.log(token.refreshToken);
    await this.updateRefreshToken(user.id, token.refreshToken);
    return token;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
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
    if (!user || !user.token)
      throw new HttpException('Invalid user or token', HttpStatus.FORBIDDEN);

    const isTokenValid = await bcryptjs.compare(token, user.token);
    console.log(isTokenValid);

    if (!isTokenValid)
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);

    const tokens = await this.getTokens(userId, user.username, user.role);
    await this.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.userService.update(userId, { refreshToken: null });
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
