import { Hono } from 'https://deno.land/x/hono@v3.12.8/mod.ts';
import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { composeApplication, createPostgresRepositories } from './CompositionRoot.ts';

// 環境変数の取得
const DATABASE_URL = Deno.env.get('DATABASE_URL') || 'postgres://postgres:password@localhost:5432/myapp';

// PostgreSQLクライアントの設定
const client = new Client(DATABASE_URL);

// データベース接続の初期化
async function initDatabase() {
  try {
    await client.connect();
    console.log('データベースに接続しました');
  } catch (error) {
    console.error('データベース接続エラー:', error);
  }
}

const repositories = createPostgresRepositories( DATABASE_URL);
const application = composeApplication(repositories);

// Honoアプリケーションの作成
const app = new Hono();

// 新しい投稿作成
app.post('/posts', async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, genre_id, title, content } = body;
    
    if (!user_id || !title || !content) {
      return c.json({ error: 'ユーザーID、タイトル、内容は必須です' }, 400);
    }
    
    const result = await client.queryArray(
      'INSERT INTO posts (user_id, genre_id, title, content) VALUES ($1, $2, $3, $4) RETURNING id, user_id, genre_id, title, content, created_at',
      [user_id, genre_id, title, content]
    );
    
    const post = {
      id: result.rows[0][0],
      user_id: result.rows[0][1],
      genre_id: result.rows[0][2],
      title: result.rows[0][3],
      content: result.rows[0][4],
      created_at: result.rows[0][5]
    };
    
    return c.json(post, 201);
  } catch (error) {
    console.error('投稿作成エラー:', error);
    return c.json({ error: '投稿の作成に失敗しました' }, 500);
  }
});

// ジャンル毎の投稿数統計
app.get('/stats/posts-by-genre', async (c) => {
  try {
    const result = await client.queryArray(`
      SELECT g.name as genre_name, COUNT(p.id) as post_count
      FROM genres g
      LEFT JOIN posts p ON g.id = p.genre_id
      GROUP BY g.id, g.name
      ORDER BY post_count DESC, g.name
    `);
    
    const stats = result.rows.map(row => ({
      genre_name: row[0],
      post_count: parseInt(row[1])
    }));
    
    return c.json(stats);
  } catch (error) {
    console.error('統計取得エラー:', error);
    return c.json({ error: '統計の取得に失敗しました' }, 500);
  }
});

// 日別ジャンル投稿数統計
app.get('/stats/posts-by-genre-daily', async (c) => {
  try {
    const result = await client.queryArray(`
      SELECT 
        DATE(p.created_at) as post_date,
        g.name as genre_name,
        COUNT(p.id) as post_count
      FROM posts p
      JOIN genres g ON p.genre_id = g.id
      GROUP BY DATE(p.created_at), g.id, g.name
      ORDER BY post_date DESC, g.name
    `);
    
    const dailyStats = result.rows.map(row => ({
      post_date: row[0],
      genre_name: row[1],
      post_count: parseInt(row[2])
    }));
    
    return c.json(dailyStats);
  } catch (error) {
    console.error('日別統計取得エラー:', error);
    return c.json({ error: '日別統計の取得に失敗しました' }, 500);
  }
});

// 外部APIに日別ジャンル統計データを送信
app.post('/stats/send-to-external-api', async (c) => {
  try {
    // 日別ジャンル統計データを取得
    const result = await client.queryArray(`
      SELECT 
        DATE(p.created_at) as post_date,
        g.name as genre_name,
        COUNT(p.id) as post_count
      FROM posts p
      JOIN genres g ON p.genre_id = g.id
      GROUP BY DATE(p.created_at), g.id, g.name
      ORDER BY post_date DESC, g.name
    `);
    
    const dailyStats = result.rows.map(row => ({
      date: row[0],
      genre: row[1],
      count: parseInt(row[2])
    }));
    
    // 外部APIのURL（環境変数から取得、デフォルトはlocalhost:4000）
    const externalApiUrl = Deno.env.get('EXTERNAL_API_URL') || 'http://localhost:4000';
    const endpoint = `${externalApiUrl}/api/v1/stats/daily-genre`;
    
    console.log(`外部APIにデータを送信中: ${endpoint}`);
    console.log('送信データ:', dailyStats);
    
    // 外部APIにデータを送信
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dailyStats)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('外部API送信エラー:', errorData);
      return c.json({ 
        error: '外部APIへの送信に失敗しました',
        details: errorData,
        status: response.status
      }, 500);
    }
    
    const responseData = await response.json();
    console.log('外部API送信成功:', responseData);
    
    return c.json({
      message: '日別ジャンル統計データを外部APIに送信しました',
      sent_data: dailyStats,
      sent_count: dailyStats.length,
      external_api_response: responseData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('外部API送信エラー:', error);
    return c.json({ 
      error: '外部APIへの送信中にエラーが発生しました',
      details: error.message 
    }, 500);
  }
});

// ヘルスチェック
app.get('/health', async (c) => {
  try {
    await client.queryArray('SELECT 1');
    return c.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    return c.json({ status: 'unhealthy', database: 'disconnected' }, 500);
  }
});

// データベース初期化とサーバー起動
await initDatabase();

console.log('サーバーを起動しています...');
console.log('利用可能なエンドポイント:');
console.log('- GET  /                           - API情報');
console.log('- GET  /genres                     - ジャンル一覧');
console.log('- GET  /users                      - ユーザー一覧');
console.log('- GET  /users/:id                  - 特定のユーザー');
console.log('- POST /users                      - ユーザー作成');
console.log('- GET  /posts                      - 投稿一覧（ジャンル情報含む）');
console.log('- POST /posts                      - 投稿作成（ジャンル指定可能）');
console.log('- GET  /stats/posts-by-genre       - ジャンル毎の投稿数統計');
console.log('- GET  /stats/posts-by-genre-daily - 日別ジャンル投稿数統計');
console.log('- POST /stats/send-to-external-api - 外部APIに日別ジャンル統計データを送信');
console.log('- GET  /health                     - ヘルスチェック');

Deno.serve({ port: 3000 }, app.fetch);
