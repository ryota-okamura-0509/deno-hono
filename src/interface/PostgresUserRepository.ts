import { User, UserRepository } from '../domain/Entity/User.ts';


export type PostgresUserRepository = (client: any) => UserRepository;
type PostgresAllUsers = (client: any) => UserRepository['all'];

export const PostgresAllUsers: PostgresAllUsers = (client) => {
    return async (): Promise<User[] | undefined> => {
        const result = await client.queryArray(
            'SELECT id, name, email FROM users ORDER BY id'
        );
        if (!result || !result.rows) return undefined;
        return result.rows.map((row: any) => ({
            id: row[0],
            name: row[1],
            email: row[2],
        }));
    }
}

export const createPostgresUserRepository: PostgresUserRepository = (client) => {
    return {
        all: PostgresAllUsers(client),
    };
}