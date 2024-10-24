import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ROLE } from 'src/common/constants/constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;
}
