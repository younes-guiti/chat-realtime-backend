import { Router } from 'express';
import authRoutes from './auth.routes';
import messageRoutes from './message.routes';
import conversationRoutes from './conversation.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/messages', messageRoutes);
router.use('/conversations', conversationRoutes);

export default router;