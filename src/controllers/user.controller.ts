import { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repositories/user.repository';
import { UnauthorizedError } from '../utils/errors';

export const userController = {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();

      const query = (req.query.q as string) || '';

      if (query.trim().length < 1) {
        return res.status(200).json({ users: [] });
      }

      const users = await userRepository.searchByUsername(query, req.user.id);
      return res.status(200).json({ users });
    } catch (error) {
      next(error);
      return;
    }
  },
};