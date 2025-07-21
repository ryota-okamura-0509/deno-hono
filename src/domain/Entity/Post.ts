export type RegisteredPost = {
    id: number;
    userId: number;
    genreId: number;
    title: string;
    content: string;
    createdAt: number;
}

export type UnregisteredPost = {
    id: undefined;
    userId: number;
    genreId: number;
    title: string;
    content: string;
    createdAt: undefined;
}