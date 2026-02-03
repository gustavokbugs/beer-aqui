import { z } from 'zod';
import { UserRole } from '@/domain/entities/user.entity';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum([UserRole.CLIENT, UserRole.VENDOR]),
    isAdult: z.boolean(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const confirmEmailSchema = z.object({
  body: z.object({
    token: z.string(),
  }),
});

export const requestPasswordResetSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  }),
});
