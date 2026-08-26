import { prisma } from '../config/database';
import { RegisterInput } from '../types/auth.types';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      },
    });
  },

  async create(data: RegisterInput & { hashedPassword: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        isOnline: true,
        createdAt: true,
      },
    });
  },

  async setOnlineStatus(id: string, isOnline: boolean) {
    return prisma.user.update({
      where: { id },
      data: {
        isOnline,
        lastSeen: new Date(),
      },
    });
  },

  async searchByUsername(query: string, excludeUserId: string) {
    return prisma.user.findMany({
      where: {
        username: { contains: query, mode: 'insensitive' },
        id: { not: excludeUserId },
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        isOnline: true,
      },
      take: 10,
    });
  },
};