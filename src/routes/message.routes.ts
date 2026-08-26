import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', messageController.sendMessage);
router.get('/conversation/:conversationId', messageController.getConversationMessages);
router.patch('/conversation/:conversationId/read', messageController.markConversationAsRead);

export default router;