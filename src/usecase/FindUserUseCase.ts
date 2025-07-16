type FindUserUseCase = (id: number) => Promise<RegisteredUser | undefined>;
type FindUserUseCaseFactory = (repository: UserRepository) => FindUserUseCase;

export const createFindUserUseCase: FindUserUseCaseFactory = (repository) => {
    return async (id: number): Promise<RegisteredUser | undefined> => {
        return await repository.find(id);
    };
}
