import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  conversationId: z.string().uuid('Invalid conversation ID'),
});

export const createConversationSchema = z.object({
  participantIds: z
    .array(z.string().uuid())
    .min(1, 'At least one participant is required'),
  isGroup: z.boolean().default(false),
  name: z.string().min(1).max(100).optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;

export interface MessageDTO {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  isRead: boolean;
  createdAt: Date;
  sender: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
}

export interface ConversationDTO {
  id: string;
  isGroup: boolean;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  participants: {
    id: string;
    username: string;
    avatarUrl: string | null;
    isOnline: boolean;
  }[];
  lastMessage: MessageDTO | null;
}