import { MessageDTO } from './message.types';

export interface ServerToClientEvents {
  new_message: (message: MessageDTO) => void;
  user_typing: (payload: { conversationId: string; userId: string; username: string }) => void;
  user_stop_typing: (payload: { conversationId: string; userId: string }) => void;
  user_online: (payload: { userId: string }) => void;
  user_offline: (payload: { userId: string; lastSeen: Date }) => void;
  message_read: (payload: { messageId: string; conversationId: string; readBy: string }) => void;
  error: (payload: { message: string }) => void;
}

export interface ClientToServerEvents {
  join_conversation: (conversationId: string) => void;
  leave_conversation: (conversationId: string) => void;
  send_message: (payload: { conversationId: string; content: string }) => void;
  typing: (conversationId: string) => void;
  stop_typing: (conversationId: string) => void;
  mark_as_read: (payload: { messageId: string; conversationId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
}