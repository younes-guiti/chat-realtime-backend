import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: err.flatten().fieldErrors,
      },
    });
  }

  console.error('Unexpected error:', err);

  return res.status(500).json({
    error: {
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
}