import { Request, Response, NextFunction } from 'express';
import { messageService } from '../services/message.service';
import { sendMessageSchema } from '../types/message.types';
import { UnauthorizedError } from '../utils/errors';

export const messageController = {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();

      const input = sendMessageSchema.parse(req.body);
      const message = await messageService.sendMessage(req.user.id, input);

      res.status(201).json({ message });
    } catch (error) {
      next(error);
    }
  },

  async getConversationMessages(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();

      const { conversationId } = req.params;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const cursor = req.query.cursor as string | undefined;

      const messages = await messageService.getConversationMessages(
        req.user.id,
        conversationId,
        limit,
        cursor
      );

      res.status(200).json({ messages });
    } catch (error) {
      next(error);
    }
  },

  async markConversationAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();

      const { conversationId } = req.params;
      await messageService.markConversationAsRead(req.user.id, conversationId);

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};