import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './env';

export function createSocketServer(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
    pingTimeout: 60000,
  });

  return io;
}