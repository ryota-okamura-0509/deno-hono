
import { Result } from 'neverthrow';
import { PostRepository } from "../../domain/Gateway/PostRepository.ts";
import { RegisteredPost } from '../../domain/Entity/Post.ts';

export type GetAllPostsUseCase = () => Promise<Result<RegisteredPost[], Error>>;
export type GetAllPostsUseCaseFactory = (repository: PostRepository) => GetAllPostsUseCase;

export const createGetAllPostsUseCase: GetAllPostsUseCaseFactory = (repository) => {
    return async () => {
        const result = await repository.all();
        if (result.isErr()) {
            return Result.err(new Error("Posts not found"));
        }
        // 成功が保証されている
        return Result.ok(result.value);
    };
};