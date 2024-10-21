import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @MinLength(100)
  content: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  categoryId: number;
}
