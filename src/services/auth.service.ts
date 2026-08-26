import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { RegisterInput, LoginInput, JwtPayload } from '../types/auth.types';
import { env } from '../config/env';
import { AppError } from '../utils/errors';

const SALT_ROUNDS = 10;

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepository.create({
      ...input,
      hashedPassword,
    });

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError('Invalid or expired token', 401);
    }
  },
};

function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}