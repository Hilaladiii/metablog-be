import * as bcryptjs from 'bcryptjs';
import { Request } from 'express';

export async function isTokenValid(token: string, hashedToken: string) {
  if (!token || !hashedToken) return false;
  return await bcryptjs.compare(token, hashedToken);
}

export function isTokenExp(exp: number) {
  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
}

export function extractToken(request: Request): string {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}
