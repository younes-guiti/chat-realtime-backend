import { messageRepository } from '../repositories/message.repository';
import { conversationRepository } from '../repositories/conversation.repository';
import { SendMessageInput } from '../types/message.types';
import { ForbiddenError, NotFoundError } from '../utils/errors';

export const messageService = {
  async sendMessage(senderId: string, input: SendMessageInput) {
    const isParticipant = await conversationRepository.isParticipant(
      input.conversationId,
      senderId
    );

    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant of this conversation');
    }

    const message = await messageRepository.create({
      content: input.content,
      senderId,
      conversationId: input.conversationId,
    });

    await conversationRepository.touchUpdatedAt(input.conversationId);

    return message;
  },

  async getConversationMessages(
    userId: string,
    conversationId: string,
    limit?: number,
    cursor?: string
  ) {
    const isParticipant = await conversationRepository.isParticipant(conversationId, userId);

    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant of this conversation');
    }

    return messageRepository.findByConversation(conversationId, limit, cursor);
  },

  async markConversationAsRead(userId: string, conversationId: string) {
    const isParticipant = await conversationRepository.isParticipant(conversationId, userId);

    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant of this conversation');
    }

    return messageRepository.markAllAsReadInConversation(conversationId, userId);
  },

  async markMessageAsRead(userId: string, messageId: string, conversationId: string) {
    const isParticipant = await conversationRepository.isParticipant(conversationId, userId);

    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant of this conversation');
    }

    return messageRepository.markAsRead(messageId);
  },
};