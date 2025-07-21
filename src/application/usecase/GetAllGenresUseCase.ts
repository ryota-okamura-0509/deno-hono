import { RegisteredGenre } from "../../domain/Entity/Genre.ts";
import { GenreRepository } from "../../domain/Gateway/GenreRepository.ts";


export type GetAllGenresUseCase = () => Promise<RegisteredGenre[] | undefined>;

type GetAllGenresUseCaseFactory = (repository: GenreRepository) => GetAllGenresUseCase;

export const createGetAllGenresUseCase: GetAllGenresUseCaseFactory = (repository) => {
    return async (): Promise<RegisteredGenre[] | undefined> => {
        return await repository.all();
    };
}
