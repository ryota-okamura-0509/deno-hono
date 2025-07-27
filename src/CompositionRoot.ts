import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { createPostgresGenreRepository } from './infra/PostgresGenreRepository.ts';
import { GenreRepository } from './domain/Gateway/GenreRepository.ts';
import { RegisteredGenre } from './domain/Entity/Genre.ts';

import { createPostgresUserRepository } from './infra/PostgresUserRepository.ts';
import { UserRepository } from './domain/Gateway/UserRepository.ts';
import { RegisteredUser, UnregisteredUser } from './domain/Entity/User.ts';
import { Result } from 'neverthrow';
import { PostRepository } from './domain/Gateway/PostRepository.ts';
import { createPostgresPostRepository } from './infra/PostgresPostRepository.ts';
import { RegisteredPost } from './domain/Entity/Post.ts';
import { createGetAllPostsUseCase, getAllPostsUseCase } from './application/usecase/GetAllPostsUseCase.ts';
import { createGetAllUserUseCase, GetAllUsersUseCase, UsersNotFoundError } from './application/usecase/GetAllUsersUsecase.ts';
import { createFindUserUseCase, FindUserUseCase } from './application/usecase/FindUserUseCase.ts';
import { createSaveUserUseCase, SaveUserUseCase } from './application/usecase/SaveUserUseCase.ts';
import { createGetAllGenresUseCase, GetAllGenresUseCase } from './application/usecase/GetAllGenresUseCase.ts';


type Repositories = {
    genreRepository: GenreRepository;
    userRepository: UserRepository;
    postRepository: PostRepository;
}

export type UseCases = {
    getAllGenresUseCase: GetAllGenresUseCase;
    getAllUsersUseCase: GetAllUsersUseCase;
    findUserUseCase: FindUserUseCase;
    saveUserUseCase: SaveUserUseCase;
    getAllPostsUseCase: getAllPostsUseCase;
}

export const createPostgresRepositories = (databaseUrl: string): Repositories => {
    const client = new Client(databaseUrl);
    const genreRepository: GenreRepository = createPostgresGenreRepository(client);
    const userRepository: UserRepository = createPostgresUserRepository(client);
    const postRepository: PostRepository = createPostgresPostRepository(client);
    return {
        genreRepository,
        userRepository,
        postRepository,
    };
}

export const composeApplication = (repositories: Repositories): UseCases =>  {
    const getAllGenresUseCase = createGetAllGenresUseCase(repositories.genreRepository);
    const getAllUsersUseCase = createGetAllUserUseCase(repositories.userRepository);
    const findUserUseCase = createFindUserUseCase(repositories.userRepository);
    const saveUserUseCase = createSaveUserUseCase(repositories.userRepository);
    const getAllPostsUseCase = createGetAllPostsUseCase(repositories.postRepository);
    return {
        getAllGenresUseCase,
        getAllUsersUseCase,
        findUserUseCase,
        saveUserUseCase,
        getAllPostsUseCase
    }
}
