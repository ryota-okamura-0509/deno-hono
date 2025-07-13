import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { createPostgresGenreRepository } from './interface/PostgresGenreRepository.ts';
import { GenreRepository } from './domain/Gateway/GenreRepository.ts';
import { createGetAllGenresUseCase } from './usecase/GetAllGenresUseCase.ts';

const DATABASE_URL = Deno.env.get('DATABASE_URL') || 'postgres://postgres:password@localhost:5432/myapp';

type Repositories = {
    genreRepository: GenreRepository;
}

export const createPostgresRepositories: () => Repositories = () => {
    const client = new Client(DATABASE_URL);
    const genreRepository: GenreRepository = createPostgresGenreRepository(client);
    return {
        genreRepository,
    };
}

export const composeApplication = (repositories: Repositories) =>  {
    const getAllGenresUseCase = createGetAllGenresUseCase(repositories.genreRepository);
    return {
        getAllGenresUseCase,
    }
}
