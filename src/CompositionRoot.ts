import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { createPostgresGenreRepository } from './interface/PostgresGenreRepository.ts';
import { GenreRepository } from './domain/Gateway/GenreRepository.ts';
import { createGetAllGenresUseCase } from './usecase/GetAllGenresUseCase.ts';

import { createPostgresUserRepository } from './interface/PostgresUserRepository.ts';
import { createGetAllUserUseCase } from './usecase/GetAllUsersUsecase.ts';

type Repositories = {
    genreRepository: GenreRepository;
    userRepository: UserRepository;
}

export type UseCases = {
    getAllGenresUseCase: () => Promise<Genre[] | undefined>;
    getAllUsersUseCase: () => Promise<User[] | undefined>;
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
    return {
        getAllGenresUseCase,
        getAllUsersUseCase
    }
}
