import { Hono } from 'https://deno.land/x/hono@v3.12.8/mod.ts';
import { UseCases } from '../../CompositionRoot.ts';
import { createGetUsersRouteHandler } from './routes/user/get-users-route.ts';
import { createGetGenresRouteHandler } from './routes/genre/get-genre-route.ts';
import { createFindUserRouteHandler } from './routes/user/get-user-route.ts';
import { createPostUserRouteHandler } from './routes/user/post-user-route.ts';
import { createGetPostsRouteHandler } from './routes/post/get-posts-route.ts';

export const getHonoApp = (useCases: UseCases) => {
    const app = new Hono();

    // CORS設定
    app.use('*', async (c, next) => {
        c.header('Access-Control-Allow-Origin', '*');
        c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        if (c.req.method === 'OPTIONS') {
            return c.text('', 200);
        }
        
        await next();
    });
    
    // ルートエンドポイント
    app.get('/', (c) => {
        return c.json({ 
            message: 'Deno + Hono + PostgreSQL API',
            status: 'running',
            timestamp: new Date().toISOString()
        });
    });
    
    // ユーザー一覧取得
    app.get('/users', createGetUsersRouteHandler(useCases.getAllUsersUseCase));
    app.get('/user/:id', createFindUserRouteHandler(useCases.findUserUseCase));
    app.post('/users', createPostUserRouteHandler(useCases.saveUserUseCase));
    app.get('/genres', createGetGenresRouteHandler(useCases.getAllGenresUseCase));
    app.get('/posts', createGetPostsRouteHandler(useCases.getAllPostsUseCase));    
    return app;
}
