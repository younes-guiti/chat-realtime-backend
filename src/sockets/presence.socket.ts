import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '../types/socket-events.types';
import { userRepository } from '../repositories/user.repository';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerPresenceHandlers(io: TypedServer, socket: TypedSocket) {
  handleUserConnected(io, socket);

  socket.on('disconnect', () => handleUserDisconnected(io, socket));
}

async function handleUserConnected(_io: TypedServer, socket: TypedSocket) {
  await userRepository.setOnlineStatus(socket.data.userId, true);

  socket.broadcast.emit('user_online', { userId: socket.data.userId });
}

async function handleUserDisconnected(_io: TypedServer, socket: TypedSocket) {
  await userRepository.setOnlineStatus(socket.data.userId, false);

  socket.broadcast.emit('user_offline', {
    userId: socket.data.userId,
    lastSeen: new Date(),
  });
}