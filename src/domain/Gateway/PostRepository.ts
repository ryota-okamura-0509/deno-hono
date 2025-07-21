import { Result, ok, err } from 'neverthrow';
import { RegisteredPost } from '../Entity/Post.ts';

export interface PostRepository {
    all: () => Promise<Result<RegisteredPost[] | Error>>;
}