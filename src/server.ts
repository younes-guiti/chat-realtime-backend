import http from 'http';
import { createApp } from './app';
import { initializeSocketServer } from './sockets';
import { env } from './config/env';
import { prisma } from './config/database';

async function startServer() {
  const app = createApp();
  const httpServer = http.createServer(app);

  initializeSocketServer(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📡 Socket.io ready`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
  });

  process.on('SIGTERM', () => gracefulShutdown(httpServer));
  process.on('SIGINT', () => gracefulShutdown(httpServer));
}

async function gracefulShutdown(httpServer: http.Server) {
  console.log('\n🛑 Shutting down gracefully...');

  httpServer.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Server closed');
    process.exit(0);
  });
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});