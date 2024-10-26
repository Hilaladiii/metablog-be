import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { Message } from 'src/common/decorators/message.decorator';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @Message('Success register user')
  async register(@Body() createUserDto: CreateUserDto) {
    const isUserExists = await this.userService.findByUsername(
      createUserDto.username,
    );

    if (isUserExists)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const user = await this.userService.create(
      createUserDto.email,
      createUserDto.username,
      createUserDto.password,
      createUserDto.role,
    );
    return { email: user.email, username: user.username };
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @Message('Success get all users')
  async findAll(): Promise<IUser[]> {
    return await this.userService.find();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @Message('Success get user by id')
  async findById(@Param('id') id: string): Promise<IUser> {
    const user = await this.userService.findById(id);
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    return user;
  }
}
