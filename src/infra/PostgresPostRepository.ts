import { PostRepository } from "../domain/Gateway/PostRepository.ts";
import { Result, ok, err } from 'neverthrow';

export type PostgresPostRepository = (client: any) => PostRepository;
export type PostgresAllPost = (client: any) => PostRepository['all'];

export const postgresAllPost: PostgresAllPost = (client) => {
    return async () => {
        try {
            const result = await client.queryArray(
                'SELECT id, title, content, created_at FROM posts ORDER BY id'
            );
            if (!result || !result.rows) return err(new Error('No posts found'));
            const posts = result.rows.map((row: any) => ({
                id: row[0],
                title: row[1],
                content: row[2],
                createdAt: new Date(row[3])
            }));
            return ok(posts);
        } catch (error) {
            return err(new Error(`Database error: ${error.message}`));
        }
    };
}

export const createPostgresPostRepository: PostgresPostRepository = (client) => {
    return {
        all: postgresAllPost(client),
    };
};