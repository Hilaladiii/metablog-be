import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROLE } from '../constants/constants';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { TokenService } from 'src/providers/token/token';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) return true;
    const request: Request = context.switchToHttp().getRequest();
    const userData = this.tokenService.extractAndDecodedToken(request);

    return requireRoles.includes(userData['role']);
  }
}
