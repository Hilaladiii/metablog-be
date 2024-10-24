import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Message } from 'src/common/decorators/message.decorator';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @Message('Login successfully!')
  async login(@Body() authDto: AuthDto) {
    const token = await this.authService.login(authDto);
    return token;
  }

  @Post('logout')
  @Message('Success logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  async logout(@GetCurrentUserId() userId: string) {
    return await this.authService.logout(userId);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  async refresh(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('token') token: string,
  ) {
    return await this.authService.refreshToken(userId, token);
  }
}
