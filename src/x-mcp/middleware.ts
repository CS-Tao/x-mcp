import type { ZodRawShape } from 'zod/v3';
import type { PromptArgsRawShape, PromptContext, ResourceContext, ToolContext, XMCPContext } from './context';
import type { ModResult } from './mod';
import { compose } from './utils/compose';
import type { Promisable } from './utils/type';

export type MiddlewareContext<CustomContext extends object = object> =
  | ToolContext<ZodRawShape, CustomContext>
  | PromptContext<PromptArgsRawShape, CustomContext>
  | ResourceContext<CustomContext>;

export type Middleware<CustomContext extends object = object> = (
  context: MiddlewareContext<CustomContext>,
  next: () => Promise<ModResult>,
) => Promise<ModResult>;

export const run = <CustomContext extends object = object, Result extends ModResult = ModResult>(
  modAction: (context: XMCPContext<CustomContext>) => Promisable<Result>,
  initialContext: MiddlewareContext<CustomContext>,
  middlewares: Middleware<MiddlewareContext<CustomContext>>[],
): Promisable<Result> => {
  const composed = compose<MiddlewareContext<CustomContext>, ModResult>(middlewares);
  return composed(initialContext, async (ctx) => await modAction(ctx)) as Promisable<Result>;
};
