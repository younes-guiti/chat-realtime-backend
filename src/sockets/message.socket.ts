import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '../types/socket-events.types';
import { messageService } from '../services/message.service';
import { conversationRepository } from '../repositories/conversation.repository';
import { sendMessageSchema } from '../types/message.types';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerMessageHandlers(io: TypedServer, socket: TypedSocket) {
  socket.on('join_conversation', (conversationId) => handleJoinConversation(socket, conversationId));
  socket.on('leave_conversation', (conversationId) => handleLeaveConversation(socket, conversationId));
  socket.on('send_message', (payload) => handleSendMessage(io, socket, payload));
}

async function handleJoinConversation(socket: TypedSocket, conversationId: string) {
  const isParticipant = await conversationRepository.isParticipant(
    conversationId,
    socket.data.userId
  );

  if (!isParticipant) {
    socket.emit('error', { message: 'You are not a participant of this conversation' });
    return;
  }

  socket.join(conversationId);
}

function handleLeaveConversation(socket: TypedSocket, conversationId: string) {
  socket.leave(conversationId);
}

async function handleSendMessage(
  io: TypedServer,
  socket: TypedSocket,
  payload: { conversationId: string; content: string }
) {
  try {
    const input = sendMessageSchema.parse(payload);

    const message = await messageService.sendMessage(socket.data.userId, input);

    io.to(input.conversationId).emit('new_message', message);
  } catch (error) {
    socket.emit('error', {
      message: error instanceof Error ? error.message : 'Failed to send message',
    });
  }
}