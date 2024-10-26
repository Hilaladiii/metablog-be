import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async get(): Promise<Post[]> {
    const cachedPost = await this.redisService.get<Post[]>('posts');
    if (cachedPost) return cachedPost;

    const posts = await this.prismaService.post.findMany();
    await this.redisService.set('posts', posts, 60 * 5);

    return posts;
  }

  async getById(id: string): Promise<Post> {
    const cachedPostDetail = await this.redisService.get<Post>(`post_${id}`);
    if (cachedPostDetail) return cachedPostDetail;

    const postDetail = await this.prismaService.post.findUnique({
      where: { id },
    });
    await this.redisService.set<Post>(`post_${id}`, postDetail, 60 * 60);
    return postDetail;
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
