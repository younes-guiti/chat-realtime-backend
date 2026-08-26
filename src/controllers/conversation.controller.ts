import { Request, Response, NextFunction } from 'express';
import { conversationService } from '../services/conversation.service';
import { createConversationSchema } from '../types/message.types';
import { UnauthorizedError } from '../utils/errors';

export const conversationController = {
  async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();

      const input = createConversationSchema.parse(req.body);
      const conversation = await conversationService.createConversation(req.user.id, input);

      res.status(201).json({ conversation });
    } catch (error) {
      next(error);
    }
  },

  async getUserConversations(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();

      const conversations = await conversationService.getUserConversations(req.user.id);

      res.status(200).json({ conversations });
    } catch (error) {
      next(error);
    }
  },

  async getConversationById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();

      const { conversationId } = req.params;
      const conversation = await conversationService.getConversationById(
        req.user.id,
        conversationId
      );

      res.status(200).json({ conversation });
    } catch (error) {
      next(error);
    }
  },
};