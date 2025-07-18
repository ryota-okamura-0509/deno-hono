import { RegisteredUser, UnregisteredUser } from '../domain/Entity/User.ts';
import { UserRepository } from '../domain/Gateway/UserRepository.ts';
import { Result } from 'neverthrow';

export type SaveUserUseCaseError = UserRepositoryError | UserCreationError;
type SaveUserUseCase = (user: UnregisteredUser) => Promise<Result<RegisteredUser, SaveUserUseCaseError>>;
type SaveUserUseCaseFactory = (repository: UserRepository) => SaveUserUseCase;

export const createSaveUserUseCase: SaveUserUseCaseFactory = (repository) => {
    return async (user: UnregisteredUser) => {
        return await repository.save(user);
    }
}
