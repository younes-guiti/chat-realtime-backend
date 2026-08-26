import { Router } from 'express';
import { conversationController } from '../controllers/conversation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', conversationController.createConversation);
router.get('/', conversationController.getUserConversations);
router.get('/:conversationId', conversationController.getConversationById);

export default router;