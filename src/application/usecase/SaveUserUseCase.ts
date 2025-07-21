
import { Result } from 'neverthrow';
import { RegisteredUser, UnregisteredUser, UserCreationError } from '../../domain/Entity/User.ts';
import { UserRepository, UserRepositoryError } from '../../domain/Gateway/UserRepository.ts';

export type SaveUserUseCaseError = UserRepositoryError | UserCreationError;
export type SaveUserUseCase = (user: UnregisteredUser) => Promise<Result<RegisteredUser, SaveUserUseCaseError>>;
type SaveUserUseCaseFactory = (repository: UserRepository) => SaveUserUseCase;

export const createSaveUserUseCase: SaveUserUseCaseFactory = (repository) => {
    return async (user: UnregisteredUser) => {
        return await repository.save(user);
    }
}
