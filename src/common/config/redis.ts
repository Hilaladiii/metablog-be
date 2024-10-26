import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOption: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: 'localhost',
        port: 6379,
      },
      ttl: 0,
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
