import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '../types/socket-events.types';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerTypingHandlers(io: TypedServer, socket: TypedSocket) {
  socket.on('typing', (conversationId) => handleTyping(socket, conversationId));
  socket.on('stop_typing', (conversationId) => handleStopTyping(socket, conversationId));
}

function handleTyping(socket: TypedSocket, conversationId: string) {
  socket.to(conversationId).emit('user_typing', {
    conversationId,
    userId: socket.data.userId,
    username: socket.data.username,
  });
}

function handleStopTyping(socket: TypedSocket, conversationId: string) {
  socket.to(conversationId).emit('user_stop_typing', {
    conversationId,
    userId: socket.data.userId,
  });
}