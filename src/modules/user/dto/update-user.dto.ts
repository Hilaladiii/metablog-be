import { IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(5)
  username?: string;

  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsOptional()
  refreshToken?: string;
}
