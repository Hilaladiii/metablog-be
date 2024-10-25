import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROLE } from '../constants/constants';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { extractToken } from '../utils/token.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) return true;
    const request: Request = context.switchToHttp().getRequest();
    const token = extractToken(request);
    const userData = this.jwtService.verify(token);

    return requireRoles.includes(userData['role']);
  }
}
