import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../constants/constants';

export const ROLES_KEY = 'roles';
export const Role = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);
