export interface GenreRepository {
    all: () => Promise<RegisteredGenre[] | undefined>;
}
