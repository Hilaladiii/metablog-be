import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Message } from 'src/common/decorators/message.decorator';
import { Role } from '../../common/decorators/role.decorator';
import { ROLE } from 'src/common/constants/constants';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types/jwt.type';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @Message('Success get all posts')
  @UseGuards(AccessTokenGuard)
  async get() {
    return await this.postService.get();
  }

  @Get(':id')
  @Message('Success get post by id')
  @UseGuards(AccessTokenGuard)
  async getById(@Param('id') id: string) {
    return await this.postService.getById(id);
  }

  @Post('create')
  @Role(ROLE.WRITER)
  @Message('Success create post')
  @UseGuards(AccessTokenGuard)
  async create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    const userId = request.user as JwtPayload;
    const post = await this.postService.create(
      createPostDto.title,
      createPostDto.content,
      userId.sub,
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
  @Role(ROLE.WRITER)
  @Message('Success delete post')
  @UseGuards(AccessTokenGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.postService.delete(id);
  }

  @Put('update/:id')
  @Role(ROLE.WRITER)
  @Message('Success update post')
  @UseGuards(AccessTokenGuard)
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
