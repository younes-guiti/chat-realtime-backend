import { prisma } from '../config/database';

const conversationWithParticipantsSelect = {
  id: true,
  isGroup: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  participants: {
    select: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          isOnline: true,
        },
      },
    },
  },
} as const;

export const conversationRepository = {
  async create(participantIds: string[], isGroup: boolean, name?: string) {
    return prisma.conversation.create({
      data: {
        isGroup,
        name,
        participants: {
          create: participantIds.map((userId) => ({ userId })),
        },
      },
      select: conversationWithParticipantsSelect,
    });
  },

  async findById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      select: conversationWithParticipantsSelect,
    });
  },

  async findByUserId(userId: string) {
    return prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      select: conversationWithParticipantsSelect,
      orderBy: { updatedAt: 'desc' },
    });
  },

  async findExistingDirectConversation(userId1: string, userId2: string) {
    return prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId: userId1 } } },
          { participants: { some: { userId: userId2 } } },
        ],
      },
      select: conversationWithParticipantsSelect,
    });
  },

  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: { userId, conversationId },
      },
    });
    return participant !== null;
  },

  async touchUpdatedAt(id: string) {
    return prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
  },
};