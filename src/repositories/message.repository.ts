import { prisma } from '../config/database';

const messageSenderSelect = {
  id: true,
  content: true,
  senderId: true,
  conversationId: true,
  isRead: true,
  createdAt: true,
  sender: {
    select: {
      id: true,
      username: true,
      avatarUrl: true,
    },
  },
} as const;

export const messageRepository = {
  async create(data: { content: string; senderId: string; conversationId: string }) {
    return prisma.message.create({
      data,
      select: messageSenderSelect,
    });
  },

  async findByConversation(conversationId: string, limit = 50, cursor?: string) {
    return prisma.message.findMany({
      where: { conversationId },
      select: messageSenderSelect,
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });
  },

  async findLastByConversation(conversationId: string) {
    return prisma.message.findFirst({
      where: { conversationId },
      select: messageSenderSelect,
      orderBy: { createdAt: 'desc' },
    });
  },

  async markAsRead(messageId: string) {
    return prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  },

  async markAllAsReadInConversation(conversationId: string, exceptSenderId: string) {
    return prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: exceptSenderId },
        isRead: false,
      },
      data: { isRead: true },
    });
  },
};