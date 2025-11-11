import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PromptContext, ToolContext, XMCPContext } from './context';
import { type Middleware, run } from './middleware';
import type { Mod } from './mod';
import type { XMCPOptions } from './option';

// 用于验重
const actionMap: Record<string, string> = {};
const checkActionNameConflict = (actionName: string, mod: Mod) => {
  if (actionMap[actionName]) {
    throw new Error(`Action name ${actionName} already exists in ${actionMap[actionName]}`);
  }
  actionMap[actionName] = mod.name;
};

const createInitialContext = <CustomContext extends object = object>(
  options: XMCPOptions,
  mod: Mod,
  actionType: 'tool' | 'prompt' | 'resource',
  actionName: string,
  customContext: CustomContext,
): XMCPContext<CustomContext> => ({
  ...options,
  modName: mod.name,
  modVersion: mod.version,
  actionType,
  actionName,
  ...customContext,
});

export const createServer = (options: XMCPOptions, mods: Mod[], middlewares: Middleware[]): McpServer => {
  const server = new McpServer({
    name: options.name,
    version: options.version,
  });

  for (const mod of mods) {
    mod.tools?.forEach((tool) => {
      const { name, config, handler, initializeContext } = tool;
      checkActionNameConflict(name, mod);
      const callback = async (...toolArgs: unknown[]) => {
        const args = (toolArgs[1] ? toolArgs[0] : undefined) as ToolContext['args'];
        const extra = (toolArgs[1] ? toolArgs[1] : toolArgs[0]) as ToolContext['extra'];
        const initialContext = createInitialContext(options, mod, 'tool', name, { args, extra });
        const context = (await initializeContext?.(initialContext)) || initialContext;
        return await run(handler, context, middlewares);
      };
      // 类型推导层级过深，用 any 能大幅提升编译效率
      server.registerTool(name, config as any, callback);
    });
    mod.prompts?.forEach((prompt) => {
      const { name, config, initializeContext, handler } = prompt;
      checkActionNameConflict(name, mod);
      const callback = async (...promptArgs: unknown[]) => {
        const args = (promptArgs[1] ? promptArgs[0] : undefined) as PromptContext['args'];
        const extra = (promptArgs[1] ? promptArgs[1] : promptArgs[0]) as PromptContext['extra'];
        const initialContext = createInitialContext(options, mod, 'prompt', name, {
          args,
          extra,
        });
        const context = (await initializeContext?.(initialContext)) || initialContext;
        return await run(handler, context, middlewares);
      };
      // 类型推导层级过深，用 any 能大幅提升编译效率
      server.registerPrompt(name, config as any, callback);
    });
    mod.resources?.forEach((resource) => {
      const { name, uri, config, handler, initializeContext } = resource;
      checkActionNameConflict(name, mod);
      server.registerResource(name, uri, config, async (uri, extra) => {
        const initialContext = createInitialContext(options, mod, 'resource', name, {
          uri,
          extra,
        });
        const context = (await initializeContext?.(initialContext)) || initialContext;
        return await run(handler, context, middlewares);
      });
    });
  }

  return server;
};
