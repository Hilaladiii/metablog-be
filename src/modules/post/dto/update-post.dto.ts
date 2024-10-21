import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @MinLength(100)
  content: string;
}
