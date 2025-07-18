export type RegisteredUser = {
    id: number;
    name: string;
    email: string;
    createAt: Date;
}

export type UnregisteredUser = {
    id: undefined;
    name: string;
    email: string;
    createdAt: undefined;
};

// MEMO: これこそZod??
// MEMO: エラーの定義はファイル分けるべき？
export type MissingNameError = {
    type: "MissingName";
    message: "ユーザー名が必要です";
};
export type MissingEmailError = {
    type: "MissingEmail";
    message: "メールアドレスが必要です";
};
export type InvalidEmailError = {
    type: "InvalidEmail";
    message: "正しいメールアドレスではありません";
};

// MEMO: domain層、usecase層、infra層でエラーの型を定義するであっている？
export type UserCreationError = MissingNameError | MissingEmailError | InvalidEmailError;

// MEMO: ユーザー登録用のデータを作るファクトリ関数は必要？バリデーションをしたかったので追加
export const createUnregisteredUser = (name: string, email: string): Result<UnregisteredUser, UserCreationError> => {
    if (!name) {
        return err({
            type: "MissingName",
            message: "ユーザー名が必要です"
        });
    }
    if (!email) {
        return err({
            type: "MissingEmail",
            message: "メールアドレスが必要です"
        });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return err({
            type: "InvalidEmail",
            message: "正しいメールアドレスではありません"
        });
    }
    return ok({
        id: undefined,
        name,
        email,
        createdAt: undefined
    });
}

// registeredUser.isAdmin(); // true
// registeredUser.setAdmin(false); // false
// // registeredUser._isAdmin = false;
// registeredUser.isAdmin(); // false



// // 公開関数
// const isAdmin = ({ id, isAdmin }: RegisteredUser) => isAdmin || id === 0;

// const changeToAdmin = (registeredUser: RegisteredUser) => ({...registeredUser, isAdmin: true})

// const normalUser = { ...}
// isAdmin(normalUser) // 必ずfalse
// const adminUser = changeToAdmin(normalUser)
// isAdmin(adminUser) // 必ずtrue


// const _isAdmin = isAdmin(registeredUser)

// export type RegisteredUser = {
//     id: number;
//     name: string;
//     email: string;
//     isAdmin: boolean;
//     createdAt: Date;
// }

// export type UnregisteredUser = {
//     id: undefined;
//     name: string;
//     email: string;
//     createdAt: undefined;
// }

// // 直和
// type User = RegisteredUser | UnregisteredUser

// const user: User = getUserFromParams();
// // user = Registered | Unregistered
// // Narrowing: TypeScript

// if (user.id) {
//     // RegisteredUserが確定
//     console.log(user.createdAt); // おこられない
// } else {
//     // UnregisteredUserが確定
//     console.log(user.createdAt); // おこられる
// }


