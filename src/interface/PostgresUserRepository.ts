import { User, UserRepository } from '../domain/Entity/User.ts';


export type PostgresUserRepository = (client: any) => UserRepository;
type PostgresAllUsers = (client: any) => UserRepository['all'];
type PostgresFindUser = (client: any) => UserRepository['find'];

export const PostgresAllUsers: PostgresAllUsers = (client) => {
    return async (): Promise<RegisteredUser[] | undefined> => {
        const result = await client.queryArray(
            'SELECT id, name, email, created_at FROM users ORDER BY id'
        );
        if (!result || !result.rows) return undefined;
        return result.rows.map((row: any) => ({
            id: row[0],
            name: row[1],
            email: row[2],
            createdAt: new Date(row[3])
        }));
    }
}

export const postgresFindUser: PostgresFindUser = (client, id) => {
    return async (id: number): Promise<RegisteredUser | undefined> => {
        const result = await client.queryArray(
            'SELECT id, name, email, created_at FROM users WHERE id = $1',
            [id]
        );
        if (!result || !result.rows || result.rows.length === 0) return undefined;
        const row = result.rows[0];
        return {
            id: row[0],
            name: row[1],
            email: row[2],
            createdAt: new Date(row[3])
        };
    }
}

export const createPostgresUserRepository: PostgresUserRepository = (client) => {
    return {
        all: PostgresAllUsers(client),
        find: postgresFindUser(client)
    };
}