import { Global, Module } from '@nestjs/common';
import { TokenService } from './token';

@Global()
@Module({
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
