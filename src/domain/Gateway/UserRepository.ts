export type UserCreationFailedError = {
    type: "UserCreationFailed";
    message: string;
}

export type UserRepositoryError = UserCreationFailedError;

export interface UserRepository {
    all: () => Promise<Result<RegisteredUser[]>>;
    find: (id: number) => Promise<Result<RegisteredUser>>;
    save: (user: UnregisteredUser) => Promise<Result<RegisteredUser, UserCreationFailedError>>;
}