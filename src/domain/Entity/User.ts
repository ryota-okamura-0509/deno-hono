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


