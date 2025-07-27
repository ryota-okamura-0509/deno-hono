
import { Result } from 'neverthrow';
import { RegisteredUser } from '../../domain/Entity/User.ts';
import { UserRepository } from '../../domain/Gateway/UserRepository.ts';

export type FindUserUseCase = (id: number) => Promise<Result<RegisteredUser, Error>>;
type FindUserUseCaseFactory = (repository: UserRepository) => FindUserUseCase;

export const createFindUserUseCase: FindUserUseCaseFactory = (repository) => {
    return async (id: number) => {
        return await repository.find(id);
    };
}
