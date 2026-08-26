import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createSocketServer } from '../config/socket';
import { authService } from '../services/auth.service';
import { userRepository } from '../repositories/user.repository';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '../types/socket-events.types';
import { registerPresenceHandlers } from './presence.socket';
import { registerMessageHandlers } from './message.socket';
import { registerTypingHandlers } from './typing.socket';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function initializeSocketServer(httpServer: HTTPServer): TypedServer {
  const io = createSocketServer(httpServer) as TypedServer;

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const payload = authService.verifyToken(token);
      const user = await userRepository.findById(payload.userId);

      if (!user) {
        return next(new Error('User no longer exists'));
      }

      socket.data.userId = user.id;
      socket.data.username = user.username;

      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: TypedSocket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.data.username})`);

    registerPresenceHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerTypingHandlers(io, socket);
  });

  return io;
}