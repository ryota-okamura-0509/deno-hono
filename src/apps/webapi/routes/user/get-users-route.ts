export const createGetUsersRouteHandler =
  (getAllUsersUseCase: GetAllGenresUseCase) => async (c) => {
    try {
      const result = await getAllUsersUseCase();
      if (!result) {
        return c.json({ error: "ユーザーが見つかりません" }, 404);
      }

      return c.json(result);
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      return c.json({ error: "ユーザーの取得に失敗しました" }, 500);
    }
};
