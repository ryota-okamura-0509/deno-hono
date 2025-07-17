import { RegisteredUser, UnregisteredUser } from '../domain/Entity/User.ts';
import { UserRepository } from '../domain/Gateway/UserRepository.ts';
import { Result, ok, err } from 'neverthrow';


export type PostgresUserRepository = (client: any) => UserRepository;
type PostgresAllUsers = (client: any) => UserRepository['all'];
type PostgresFindUser = (client: any) => UserRepository['find'];
type PostgresSaveUser = (client: any) => UserRepository['save'];

export const PostgresAllUsers: PostgresAllUsers = (client) => {
    return async () => {
        const result = await client.queryArray(
            'SELECT id, name, email, created_at FROM users ORDER BY id'
        );
        if (!result || !result.rows) {
            return err({
                message: "not found"
            })
        };
        return ok(result.rows.map((row: any) => ({
            id: row[0],
            name: row[1],
            email: row[2],
            createdAt: new Date(row[3])
        })));
    }
}

export const postgresFindUser: PostgresFindUser = (client) => {
    return async (id: number) => {
        const result = await client.queryArray(
            'SELECT id, name, email, created_at FROM users WHERE id = $1',
            [id]
        );
        if (!result || !result.rows || result.rows.length === 0) {
            return err({
                message: "User not found"
            });
        }
        const row = result.rows[0];
        return ok({
            id: row[0],
            name: row[1],
            email: row[2],
            createdAt: new Date(row[3])
        });
    }
}

export const postgresSaveUser: PostgresSaveUser = (client) => {
    return async (user: UnregisteredUser) => {
        const result = await client.queryArray(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
            [user.name, user.email]
        );
        if (!result || !result.rows || result.rows.length === 0) {
            return err({
                message: "User creation failed"
            });
        }
        const row = result.rows[0];
        return ok({
            id: row[0],
            name: row[1],
            email: row[2],
            createdAt: new Date(row[3])
        });
    }
}

export const createPostgresUserRepository: PostgresUserRepository = (client) => {
    return {
        all: PostgresAllUsers(client),
        find: postgresFindUser(client),
        save: postgresSaveUser(client)
    };
}
