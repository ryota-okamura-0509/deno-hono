import { User, UserRepository } from '../domain/Entity/User.ts';

type GetAllUsersUseCase = () => Promise<User[] | undefined>;
type GetAllUsersUseCaseFactory = (repository: UserRepository) => GetAllUsersUseCase;

export const createGetAllUserUseCase: GetAllUsersUseCaseFactory = (repository) =>  {
    return async (): Promise<User[] | undefined> => {
        return await repository.all();
    }
}