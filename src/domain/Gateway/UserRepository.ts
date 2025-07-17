export interface UserRepository {
    all: () => Promise<Result<RegisteredUser[]>>;
    find: (id: number) => Promise<Result<RegisteredUser>>;
    save: (user: UnregisteredUser) => Promise<Result<RegisteredUser>>;
}