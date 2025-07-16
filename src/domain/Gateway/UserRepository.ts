export interface UserRepository {
    all: () => Promise<RegisteredUser[] | undefined>;
    find: (id: number) => Promise<RegisteredUser | undefined>;
}