export type RegisteredGenre = {
    id: number;
    name: string;
    createAt: Date;
}

export type UnregisteredGenre = {
    id: undefined;
    name: string;
    createdAt: undefined;
};