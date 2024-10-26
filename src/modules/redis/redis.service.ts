import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: CacheStore) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheService.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheService.set(key, value, { ttl });
  }
}
