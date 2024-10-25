import { ConfigService } from '@nestjs/config';

export const jwtConstant = (config: ConfigService): string => {
  return config.get<string>('JWT_SECRET');
};

export const config = new ConfigService();

export enum ROLE {
  READER = 'READER',
  WRITER = 'WRITER',
}
