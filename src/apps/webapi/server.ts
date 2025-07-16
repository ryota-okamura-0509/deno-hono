

import { createPostgresRepositories, composeApplication } from '../../CompositionRoot.ts';
import { getHonoApp } from './app.ts';

// 環境変数の取得
const databaseUrl = Deno.env.get('DATABASE_URL') || 'postgres://postgres:password@localhost:5432/myapp';

const repositories = createPostgresRepositories(databaseUrl);

const useCases = composeApplication(repositories);

const honoApp = getHonoApp(useCases);

Deno.serve({ port: 3000 }, honoApp.fetch);
