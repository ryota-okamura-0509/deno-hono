import { Genre, GenreRepository } from "../domain/Gateway/GenreRepository.ts";

export type PostgresGenreRepository = (client: any) => GenreRepository;
type PostgresAllGenres = (client: any) => GenreRepository['all'];

export const PostgresAllGenres: PostgresAllGenres = (client) => {
    return async (): Promise<RegisteredGenre[] | undefined> => {
        const result = await client.queryArray(
            'SELECT id, name, created_at  FROM genres ORDER BY id'
        );
        if (!result || !result.rows) return undefined;
        return result.rows.map((row: any) => ({
            id: row[0],
            name: row[1],
            createdAt: new Date(row[2]) // created_at is nullable
        }));
    }
}

// 高階関数を利用したDIパターンでPostgresGenreRepositoryの実装
export const createPostgresGenreRepository: PostgresGenreRepository = (client) => {
    return {
        all: PostgresAllGenres(client),
    };
};
