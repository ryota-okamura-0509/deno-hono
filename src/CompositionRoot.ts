import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { createPostgresGenreRepository } from './infra/PostgresGenreRepository.ts';
import { GenreRepository } from './domain/Gateway/GenreRepository.ts';
import { createGetAllGenresUseCase } from './usecase/GetAllGenresUseCase.ts';
import { RegisteredGenre } from './domain/Entity/Genre.ts';

import { createPostgresUserRepository } from './infra/PostgresUserRepository.ts';
import { UserRepository } from './domain/Gateway/UserRepository.ts';
import { RegisteredUser, UnregisteredUser } from './domain/Entity/User.ts';
import { createGetAllUserUseCase, UsersNotFoundError } from './usecase/GetAllUsersUsecase.ts';
import { createFindUserUseCase } from './usecase/FindUserUseCase.ts';
import { createSaveUserUseCase } from './usecase/SaveUserUseCase.ts';
import { Result } from 'neverthrow';

type Repositories = {
    genreRepository: GenreRepository;
    userRepository: UserRepository;
}

export type UseCases = {
    getAllGenresUseCase: () => Promise<RegisteredGenre[] | undefined>;
    getAllUsersUseCase: () => Promise<Result<RegisteredUser[], UsersNotFoundError>>;
    findUserUseCase: (id: number) => Promise<Result<RegisteredUser, Error>>;
    saveUserUseCase: (user: UnregisteredUser) => Promise<Result<RegisteredUser, Error>>;
}

export const createPostgresRepositories: Repositories = (databaseUrl: string) => {
    const client = new Client(databaseUrl);
    const genreRepository: GenreRepository = createPostgresGenreRepository(client);
    const userRepository: UserRepository = createPostgresUserRepository(client);
    return {
        genreRepository,
        userRepository,
    };
}

export const composeApplication = (repositories: Repositories): UseCases =>  {
    const getAllGenresUseCase = createGetAllGenresUseCase(repositories.genreRepository);
    const getAllUsersUseCase = createGetAllUserUseCase(repositories.userRepository);
    const findUserUseCase = createFindUserUseCase(repositories.userRepository);
    const saveUserUseCase = createSaveUserUseCase(repositories.userRepository);
    return {
        getAllGenresUseCase,
        getAllUsersUseCase,
        findUserUseCase,
        saveUserUseCase
    }
}
