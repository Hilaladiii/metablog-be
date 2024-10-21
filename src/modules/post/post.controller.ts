import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async get() {
    return await this.postService.get();
  }

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

  @Put('update/:id')
  async update(@Body() updatePostDto: UpdatePostDto, @Param('id') id: string) {
    const post = await this.postService.update(
      id,
      updatePostDto.title,
      updatePostDto.content,
    );
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      updatedAt: post.updatedAt,
    };
  }
}
