import { Genre, GenreRepository } from "../domain/Gateway/GenreRepository.ts";

type GetAllGenresUseCase = () => Promise<Genre[] | undefined>;

type GetAllGenresUseCaseFactory = (repository: GenreRepository) => GetAllGenresUseCase;

export const createGetAllGenresUseCase: GetAllGenresUseCaseFactory = (repository) => {
    return async (): Promise<Genre[] | undefined> => {
        return await repository.all();
    };
}
