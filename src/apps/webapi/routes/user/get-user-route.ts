import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { Context } from 'https://deno.land/x/hono@v3.12.8/mod.ts';
import { 
  UserParamsSchema, 
  RegisteredUserSchema, 
  ErrorResponseSchema,
  type UserParams,
  type RegisteredUser,
  type ErrorResponse
} from '../../../../schemas/user.ts';

export const createFindUserRouteHandler =
  (findUserUseCase: (id: number) => Promise<RegisteredUser | undefined>) =>
  async (c: Context) => {
    try {
      // パラメータの検証
      const rawParams = { id: c.req.param('id') };
      const validationResult = UserParamsSchema.safeParse(rawParams);
      
      if (!validationResult.success) {
        const errorResponse: ErrorResponse = {
          error: `Invalid parameters: ${validationResult.error.issues.map(i => i.message).join(', ')}`
        };
        return c.json(errorResponse, 400);
      }

      const { id } = validationResult.data;
      const userId = parseInt(id, 10);

      // ユーザー検索
      const user = await findUserUseCase(userId);
      
      if (!user) {
        const errorResponse: ErrorResponse = {
          error: 'User not found'
        };
        return c.json(errorResponse, 404);
      }

      // レスポンスの検証（オプション：開発時の型安全性確保）
      const validUser = RegisteredUserSchema.parse(user);
      
      return c.json(validUser, 200);
      
    } catch (error) {
      console.error('Error in findUserRouteHandler:', error);
      
      if (error instanceof z.ZodError) {
        const errorResponse: ErrorResponse = {
          error: `Data validation error: ${error.issues.map(i => i.message).join(', ')}`
        };
        return c.json(errorResponse, 500);
      }
      
      const errorResponse: ErrorResponse = {
        error: 'Internal server error'
      };
      return c.json(errorResponse, 500);
    }
  };
