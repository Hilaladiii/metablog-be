import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisOption } from 'src/common/config/redis';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [CacheModule.registerAsync(RedisOption)],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
