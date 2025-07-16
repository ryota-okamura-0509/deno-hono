export interface UserRepository {
    all: () => Promise<RegisteredUser[] | undefined>;
}