import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('create')
  async create(@Body() createPostDto: CreatePostDto) {
    const post = await this.postService.create(
      createPostDto.title,
      createPostDto.content,
      createPostDto.userId,
      createPostDto.categoryId,
    );
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.postService.delete(id);
  }
}
