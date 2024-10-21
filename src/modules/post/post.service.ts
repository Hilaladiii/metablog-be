import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async get(): Promise<Post[]> {
    return await this.prismaService.post.findMany();
  }

  async create(
    title: string,
    content: string,
    userId: string,
    cateogryId: number,
  ): Promise<Post> {
    const post = await this.prismaService.post.create({
      data: {
        title,
        content,
        category: {
          connect: {
            id: cateogryId,
          },
        },
      },
    });

    await this.prismaService.write.create({
      data: {
        userId,
        postId: post.id,
      },
    });

    return post;
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }

  async update(id: string, title: string, content: string): Promise<Post> {
    return await this.prismaService.post.update({
      data: {
        title,
        content,
      },
      where: {
        id,
      },
    });
  }
}
