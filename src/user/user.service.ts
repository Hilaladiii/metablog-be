import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const hashPassword = await bcryptjs.hash(password, 10);
    return await this.prismaService.user.create({
      data: {
        email,
        username,
        password: hashPassword,
      },
    });
  }
}
