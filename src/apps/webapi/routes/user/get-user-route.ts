export const createFindUserRouteHandler =
  (findUserUseCase: (id: number) => Promise<RegisteredUser | undefined>) =>
  async (c: Context) => {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'User ID is required' }, 400);
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return c.json({ error: 'Invalid User ID' }, 400);
    }

    const user = await findUserUseCase(userId);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user, 200);
  }