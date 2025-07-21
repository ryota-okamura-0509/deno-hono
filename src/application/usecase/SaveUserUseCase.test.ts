import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { createSaveUserUseCase } from "./SaveUserUseCase.ts";
import { RegisteredUser, UnregisteredUser } from "../domain/Entity/User.ts";
import { UserRepository } from "../domain/Gateway/UserRepository.ts";

// モックユーザーリポジトリを作成する関数
const createMockUserRepository = (): UserRepository => {
    const users: RegisteredUser[] = [];
    let nextId = 1;

    return {
        async all(): Promise<RegisteredUser[] | undefined> {
            return users;
        },

        async find(id: number): Promise<RegisteredUser | undefined> {
            return users.find(user => user.id === id);
        },

        async save(user: UnregisteredUser): Promise<RegisteredUser> {
            const registeredUser: RegisteredUser = {
                id: nextId++,
                name: user.name,
                email: user.email,
                createAt: new Date()
            };
            users.push(registeredUser);
            return registeredUser;
        }
    };
};

// エラーを発生させるモックリポジトリを作成する関数
const createErrorUserRepository = (): UserRepository => {
    return {
        async all(): Promise<RegisteredUser[] | undefined> {
            throw new Error("Database error");
        },

        async find(id: number): Promise<RegisteredUser | undefined> {
            throw new Error("Database error");
        },

        async save(user: UnregisteredUser): Promise<RegisteredUser> {
            throw new Error("Database error");
        }
    };
};

Deno.test("SaveUserUseCase - 正常にユーザーを保存する", async () => {
    // Arrange
    const mockRepository = createMockUserRepository();
    const saveUserUseCase = createSaveUserUseCase(mockRepository);
    
    const unregisteredUser: UnregisteredUser = {
        id: undefined,
        name: "田中太郎",
        email: "tanaka@example.com",
        createdAt: undefined
    };

    // Act
    const result = await saveUserUseCase(unregisteredUser);

    // Assert
    assertEquals(result.id, 1);
    assertEquals(result.name, "田中太郎");
    assertEquals(result.email, "tanaka@example.com");
    assertEquals(result.createAt instanceof Date, true);
});

Deno.test("SaveUserUseCase - 複数のユーザーを保存する", async () => {
    // Arrange
    const mockRepository = createMockUserRepository();
    const saveUserUseCase = createSaveUserUseCase(mockRepository);
    
    const user1: UnregisteredUser = {
        id: undefined,
        name: "田中太郎",
        email: "tanaka@example.com",
        createdAt: undefined
    };

    const user2: UnregisteredUser = {
        id: undefined,
        name: "佐藤花子",
        email: "sato@example.com",
        createdAt: undefined
    };

    // Act
    const result1 = await saveUserUseCase(user1);
    const result2 = await saveUserUseCase(user2);

    // Assert
    assertEquals(result1.id, 1);
    assertEquals(result1.name, "田中太郎");
    assertEquals(result1.email, "tanaka@example.com");
    
    assertEquals(result2.id, 2);
    assertEquals(result2.name, "佐藤花子");
    assertEquals(result2.email, "sato@example.com");
});

Deno.test("SaveUserUseCase - リポジトリエラー時に例外が発生する", async () => {
    // Arrange
    const errorRepository = createErrorUserRepository();
    const saveUserUseCase = createSaveUserUseCase(errorRepository);
    
    const unregisteredUser: UnregisteredUser = {
        id: undefined,
        name: "田中太郎",
        email: "tanaka@example.com",
        createdAt: undefined
    };

    // Act & Assert
    await assertRejects(
        async () => {
            await saveUserUseCase(unregisteredUser);
        },
        Error,
        "Database error"
    );
});

Deno.test("SaveUserUseCase - 空の名前でユーザーを保存する", async () => {
    // Arrange
    const mockRepository = createMockUserRepository();
    const saveUserUseCase = createSaveUserUseCase(mockRepository);
    
    const unregisteredUser: UnregisteredUser = {
        id: undefined,
        name: "",
        email: "empty@example.com",
        createdAt: undefined
    };

    // Act
    const result = await saveUserUseCase(unregisteredUser);

    // Assert
    assertEquals(result.id, 1);
    assertEquals(result.name, "");
    assertEquals(result.email, "empty@example.com");
    assertEquals(result.createAt instanceof Date, true);
});

Deno.test("SaveUserUseCase - 特殊文字を含む名前でユーザーを保存する", async () => {
    // Arrange
    const mockRepository = createMockUserRepository();
    const saveUserUseCase = createSaveUserUseCase(mockRepository);
    
    const unregisteredUser: UnregisteredUser = {
        id: undefined,
        name: "山田@#$%太郎",
        email: "yamada@example.com",
        createdAt: undefined
    };

    // Act
    const result = await saveUserUseCase(unregisteredUser);

    // Assert
    assertEquals(result.id, 1);
    assertEquals(result.name, "山田@#$%太郎");
    assertEquals(result.email, "yamada@example.com");
    assertEquals(result.createAt instanceof Date, true);
});
