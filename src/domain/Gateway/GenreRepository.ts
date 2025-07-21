import { RegisteredGenre } from "../Entity/Genre.ts";

export interface GenreRepository {
    all: () => Promise<RegisteredGenre[] | undefined>;
}
