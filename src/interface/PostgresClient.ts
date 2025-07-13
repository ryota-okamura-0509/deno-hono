import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';

const DATABASE_URL = Deno.env.get('DATABASE_URL') || 'postgres://postgres:password@localhost:5432/myapp';

// PostgreSQLクライアントの設定
export const client = new Client(DATABASE_URL);