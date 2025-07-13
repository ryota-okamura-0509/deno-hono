import { Hono } from 'https://deno.land/x/hono@v3.12.8/mod.ts';

// モックサーバーアプリケーション
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

// メモリストレージ（実際のDBの代わり）
interface DailyGenreStats {
  date: string;
  genre: string;
  count: number;
  received_at: string;
}

let receivedStats: DailyGenreStats[] = [];

// モックサーバーのルートエンドポイント
app.get('/', (c) => {
  return c.json({
    message: '外部API モックサーバー',
    description: '日別ジャンル投稿数統計を受信するモックサーバー',
    endpoints: {
      'GET /': 'サーバー情報',
      'GET /openapi.yaml': 'OpenAPI仕様書',
      'POST /api/v1/stats/daily-genre': '日別ジャンル統計データ受信',
      'GET /api/v1/stats/daily-genre': '受信した統計データ一覧',
      'GET /api/v1/stats/daily-genre/latest': '最新の統計データ',
      'DELETE /api/v1/stats/daily-genre': '統計データをクリア'
    },
    timestamp: new Date().toISOString()
  });
});

// OpenAPI仕様書を提供
app.get('/openapi.yaml', async (c) => {
  try {
    const openApiContent = await Deno.readTextFile('./openapi.yaml');
    c.header('Content-Type', 'text/yaml');
    return c.text(openApiContent);
  } catch (error) {
    console.error('OpenAPI仕様書の読み込みエラー:', error);
    return c.json({ error: 'OpenAPI仕様書の読み込みに失敗しました' }, 500);
  }
});

// 日別ジャンル統計データ受信エンドポイント
app.post('/api/v1/stats/daily-genre', async (c) => {
  try {
    const data = await c.req.json();
    
    // データの検証
    if (!Array.isArray(data)) {
      return c.json({ 
        error: 'データは配列形式である必要があります',
        example: [
          {
            "date": "2025-07-14",
            "genre": "プログラミング",
            "count": 5
          }
        ]
      }, 400);
    }
    
    // データの構造チェック
    for (const item of data) {
      if (!item.date || !item.genre || item.count === undefined) {
        return c.json({ 
          error: 'データには date, genre, count フィールドが必要です',
          received: item
        }, 400);
      }
    }
    
    // 受信データを保存
    const timestamp = new Date().toISOString();
    const newStats: DailyGenreStats[] = data.map((item: any) => ({
      date: item.date,
      genre: item.genre,
      count: item.count,
      received_at: timestamp
    }));
    
    receivedStats.push(...newStats);
    
    // 成功レスポンス
    return c.json({
      message: '日別ジャンル統計データを正常に受信しました',
      received_count: newStats.length,
      timestamp: timestamp,
      data: newStats
    }, 201);
    
  } catch (error) {
    console.error('データ受信エラー:', error);
    return c.json({ 
      error: 'データの処理中にエラーが発生しました',
      details: error.message 
    }, 500);
  }
});

// 受信した統計データ一覧取得
app.get('/api/v1/stats/daily-genre', (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = (page - 1) * limit;
  
  const paginatedStats = receivedStats
    .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())
    .slice(offset, offset + limit);
  
  return c.json({
    data: paginatedStats,
    pagination: {
      page,
      limit,
      total: receivedStats.length,
      pages: Math.ceil(receivedStats.length / limit)
    },
    timestamp: new Date().toISOString()
  });
});

// 最新の統計データ取得
app.get('/api/v1/stats/daily-genre/latest', (c) => {
  const limit = parseInt(c.req.query('limit') || '10');
  
  const latestStats = receivedStats
    .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())
    .slice(0, limit);
  
  return c.json({
    data: latestStats,
    count: latestStats.length,
    timestamp: new Date().toISOString()
  });
});

// 特定の日付の統計データ取得
app.get('/api/v1/stats/daily-genre/:date', (c) => {
  const date = c.req.param('date');
  
  const dateStats = receivedStats
    .filter(stat => stat.date === date)
    .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime());
  
  return c.json({
    date,
    data: dateStats,
    count: dateStats.length,
    timestamp: new Date().toISOString()
  });
});

// 統計データをクリア
app.delete('/api/v1/stats/daily-genre', (c) => {
  const previousCount = receivedStats.length;
  receivedStats = [];
  
  return c.json({
    message: '統計データをクリアしました',
    cleared_count: previousCount,
    timestamp: new Date().toISOString()
  });
});

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    memory_usage: Deno.memoryUsage(),
    stored_records: receivedStats.length,
    timestamp: new Date().toISOString()
  });
});

// 統計情報エンドポイント
app.get('/api/v1/stats/summary', (c) => {
  const genreStats = receivedStats.reduce((acc, stat) => {
    if (!acc[stat.genre]) {
      acc[stat.genre] = { total_count: 0, records: 0 };
    }
    acc[stat.genre].total_count += stat.count;
    acc[stat.genre].records += 1;
    return acc;
  }, {} as Record<string, { total_count: number; records: number }>);
  
  const dateStats = receivedStats.reduce((acc, stat) => {
    if (!acc[stat.date]) {
      acc[stat.date] = { total_count: 0, records: 0 };
    }
    acc[stat.date].total_count += stat.count;
    acc[stat.date].records += 1;
    return acc;
  }, {} as Record<string, { total_count: number; records: number }>);
  
  return c.json({
    total_records: receivedStats.length,
    unique_genres: Object.keys(genreStats).length,
    unique_dates: Object.keys(dateStats).length,
    by_genre: genreStats,
    by_date: dateStats,
    timestamp: new Date().toISOString()
  });
});

console.log('外部API モックサーバーを起動しています...');
console.log('利用可能なエンドポイント:');
console.log('- GET    /                                - サーバー情報');
console.log('- GET    /openapi.yaml                    - OpenAPI仕様書');
console.log('- POST   /api/v1/stats/daily-genre        - 日別ジャンル統計データ受信');
console.log('- GET    /api/v1/stats/daily-genre        - 受信した統計データ一覧');
console.log('- GET    /api/v1/stats/daily-genre/latest - 最新の統計データ');
console.log('- GET    /api/v1/stats/daily-genre/:date  - 特定日の統計データ');
console.log('- DELETE /api/v1/stats/daily-genre        - 統計データをクリア');
console.log('- GET    /api/v1/stats/summary            - 統計サマリー');
console.log('- GET    /health                          - ヘルスチェック');

Deno.serve({ port: 4000 }, app.fetch);
