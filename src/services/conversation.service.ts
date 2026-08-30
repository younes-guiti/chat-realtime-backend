import { conversationRepository } from '../repositories/conversation.repository';
import { CreateConversationInput } from '../types/message.types';
import { ForbiddenError, NotFoundError, ValidationError } from '../utils/errors';

export const conversationService = {
  async createConversation(creatorId: string, input: CreateConversationInput) {
    const allParticipantIds = Array.from(new Set([creatorId, ...input.participantIds]));

    if (!input.isGroup && allParticipantIds.length !== 2) {
      throw new ValidationError('A direct conversation must have exactly 2 participants');
    }

    if (input.isGroup && allParticipantIds.length < 2) {
      throw new ValidationError('A group conversation must have at least 2 participants');
    }

    if (!input.isGroup) {
      const otherUserId = allParticipantIds.find((id) => id !== creatorId)!;

      const existing = await conversationRepository.findExistingDirectConversation(
        creatorId,
        otherUserId
      );

      if (existing) {
        return existing;
      }
    }

    return conversationRepository.create(allParticipantIds, input.isGroup, input.name);
  },

  async getUserConversations(userId: string) {
    return conversationRepository.findByUserId(userId);
  },

  async getConversationById(userId: string, conversationId: string) {
    const isParticipant = await conversationRepository.isParticipant(conversationId, userId);

    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant of this conversation');
    }

    const conversation = await conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new NotFoundError('Conversation');
    }

    return conversation;
  },
};