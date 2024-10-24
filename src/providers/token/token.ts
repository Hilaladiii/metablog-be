import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { extractToken, isTokenExp } from 'src/common/utils/token.utils';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  extractAndDecodedToken(request: Request) {
    const token = extractToken(request);
    if (!token)
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    const decoded = this.jwtService.decode(token);
    if (isTokenExp(decoded.exp))
      throw new HttpException('Token expired!', HttpStatus.UNAUTHORIZED);
    return this.jwtService.decode(token);
  }
}
