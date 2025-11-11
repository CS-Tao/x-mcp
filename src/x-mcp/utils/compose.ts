type M<C, R> = (ctx: C, next: () => Promise<R>) => Promise<R>;

export const compose =
  <C, R>(middleware: M<C, R>[]) =>
  async (ctx: C, next?: (ctx: C) => Promise<R>) => {
    const dispatch = (i: number) => async () => {
      const fn = i === middleware.length ? next : middleware[i];
      if (!fn) {
        return;
      }
      return await fn(ctx, dispatch(i + 1));
    };
    return dispatch(0)();
  };
