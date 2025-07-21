import { SaveUserUseCase } from "../../../../application/usecase/SaveUserUseCase.ts";
import { createUnregisteredUser } from "../../../../domain/Entity/User.ts";


export const createPostUserRouteHandler =
  (saveUserUseCase: SaveUserUseCase
  ) => async (c) => {
    const param = c.req.valid("json");
    /**
     * MEMO: ここで登録用のユーザーデータを作る？
     * 
     * createUnregisteredUserがResult型で返すのでエラーのチェックを10行目にする
     * saveUserUseCaseもResult型で返すので、エラーのチェックを15行目にする
     * 2回やっているのは変？？
     */
    const unregisteredUser = createUnregisteredUser(param.name, param.email);
    if (unregisteredUser.isErr()) {
        const error = unregisteredUser.error;
        return c.json({ error: error.message }, 400);
    }
    const result = await saveUserUseCase(unregisteredUser.value);
    if (result.isOK()) {
        return c.json(result.value, 201);
    }
    const error = result.error;

    switch ((error.type)) {
        case "UserCreationFailed":
            return c.json({ error: error.message }, 400);   
        case "UserCreationFailed":
            return c.json({ error: error.message }, 400);
        default:
            return c.json({ error: "Internal Server Error" }, 500);
    }
  };