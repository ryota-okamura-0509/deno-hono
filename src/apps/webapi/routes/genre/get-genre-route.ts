export const createGetGenresRouteHandler =
  (getAllGenresUseCase: () => GetAllGenresUseCase) => async (c) => {
    try {
      const result = await getAllGenresUseCase();
      if (!result) {
        return c.json({ error: "ジャンルが見つかりません" }, 404);
      }
      return c.json(result);
    } catch (error) {
      console.error("ジャンル取得エラー:", error);
      return c.json({ error: "ジャンルの取得に失敗しました" }, 500);
    }
  };
