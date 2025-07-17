import { RegisteredUser, UnregisteredUser } from '../domain/Entity/User.ts';
import { UserRepository } from '../domain/Gateway/UserRepository.ts';
import { Result } from 'neverthrow';

type SaveUserUseCase = (user: UnregisteredUser) => Promise<Result<RegisteredUser, Error>>;
type SaveUserUseCaseFactory = (repository: UserRepository) => SaveUserUseCase;

export const createSaveUserUseCase: SaveUserUseCaseFactory = (repository) => {
    return async (user: UnregisteredUser) => {
        return await repository.save(user);
    }
}
