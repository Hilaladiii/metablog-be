import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { User } from '@prisma/client';
import { ROLE } from 'src/common/constants/constants';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async create(
    email: string,
    username: string,
    password: string,
    role: ROLE,
  ): Promise<IUser> {
    const hashPassword = await argon2.hash(password);
    return await this.prismaService.user.create({
      data: {
        email,
        username,
        password: hashPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });
  }

  async find(): Promise<IUser[]> {
    const cachedUser = await this.redisService.get<IUser[]>('users');
    if (cachedUser) return cachedUser;

    const user = await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    await this.redisService.set<IUser[]>('users', user, 60 * 5);
    return user;
  }

  async findById(id: string): Promise<IUser> {
    const cachedUserDetail = await this.redisService.get<IUser>(`user_${id}`);
    if (cachedUserDetail) return cachedUserDetail;
    const userDetail = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    await this.redisService.set(`user_${id}`, userDetail, 60 * 60);
  }

  async findByUsername(username: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const dataToUpdate: {
      password?: string;
      username?: string;
      token?: string;
    } = {};
    if (updateUserDto.password) {
      dataToUpdate.password = await argon2.hash(updateUserDto.password);
    }

    if (updateUserDto.username) {
      dataToUpdate.username = updateUserDto.username;
    }

    if (updateUserDto.refreshToken) {
      dataToUpdate.token = updateUserDto.refreshToken;
    }
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });
  }
}
