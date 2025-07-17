import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// ユーザー関連のZodスキーマ
export const UserSchema = z.object({
  id: z.number().positive('User ID must be positive'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  created_at: z.date(),
});

export const RegisteredUserSchema = UserSchema;

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
});

export const UserParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'User ID must be a number'),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

// 型定義をエクスポート
export type User = z.infer<typeof UserSchema>;
export type RegisteredUser = z.infer<typeof RegisteredUserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

