import { RegisteredUser } from '../domain/Entity/User.ts';
import { UserRepository } from '../domain/Gateway/UserRepository.ts';
import { Result, ok, err } from 'neverthrow';

type GetAllUsersUseCase = () => Promise<Result<RegisteredUser[], UsersNotFoundError>>;
type GetAllUsersUseCaseFactory = (repository: UserRepository) => GetAllUsersUseCase;

// type GetAllUsersUseCase = () => Promise<User[] | undefined>;
// type GetAllUsersUseCaseFactory = (repository: UserRepository) => GetAllUsersUseCase;


// export const createGetAllUserUseCase: GetAllUsersUseCaseFactory = (repository) =>  {
//     return async ()  => {
//         const users = await repository.all();
//         if (users === undefined) {
//             return undefined;
//         }
//         return users;
//     }
// }

export type UsersNotFoundError = {
    code: "not_found";
    message: string;
}

export const createGetAllUserUseCase: GetAllUsersUseCaseFactory = (repository) =>  {
    return async ()  => {
        const result = await repository.all();
        if (result.isErr()) {
            return err({
                code: "not_found",
                message: "Users not found"
            });
        }
        // 成功が保証されている
        return ok(result.value);
    }
}
