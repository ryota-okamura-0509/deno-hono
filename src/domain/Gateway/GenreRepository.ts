export interface GenreRepository {
    all: () => Promise<Genre[] | undefined>;
}

export type Genre = {
    id: number | undefined;
    name: string;
}