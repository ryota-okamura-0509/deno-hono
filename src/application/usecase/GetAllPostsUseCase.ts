import { Result, ok, err } from 'neverthrow';
import { PostRepository } from "../../domain/Gateway/PostRepository.ts";
import { RegisteredPost } from '../../domain/Entity/Post.ts';

export type getAllPostsUseCase = (id: number) => Promise<Result<RegisteredPost[], Error>>;
export type GetAllPostsUseCaseFactory = (repository: PostRepository) => getAllPostsUseCase;




// カリー化(引数を一つ部分適用して部分適用済みの関数を返すもの)
export const createGetAllPostsUseCase: GetAllPostsUseCaseFactory = (repository) => {
    // GetAllPostsUseCaseの実装を返す
    return async () => {
        const result = await repository.all();
        if (result.isErr()) {
            return err(new Error("Posts not found"));
        }
        // 成功が保証されている
        return ok(result.value);
    };
};

