import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { UserModule } from '../user/user.module';
import { config, jwtConstant } from 'src/common/constants/constants';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstant(config),
    }),
  ],
  providers: [AuthService, RefreshTokenStrategy, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
