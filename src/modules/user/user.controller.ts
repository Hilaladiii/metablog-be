import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(
      createUserDto.email,
      createUserDto.username,
      createUserDto.password,
    );
    return { id: user.id, email: user.email, username: user.username };
  }
}
