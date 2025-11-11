import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Middleware } from './middleware';
import type { Mod } from './mod';
import type { XMCPOptions } from './option';
import { createServer } from './server';
import { createStdioTransport } from './transport';

export class XMCP {
  private server: McpServer | null = null;

  private readonly middlewares: Middleware[] = [];
  private readonly mods: Mod[] = [];

  constructor(private readonly options: XMCPOptions) {}

  public start = async (): Promise<this> => {
    if (this.server) {
      throw Error('Server already started');
    }
    this.server = createServer(this.options, this.mods, this.middlewares);
    await this.server.connect(createStdioTransport());
    return this;
  };

  public installMod = (mod: Mod | string): this => {
    if (this.server) {
      throw Error('Can not install mod after calling start');
    }
    const resolvedMods = typeof mod === 'string' ? require(require.resolve(mod)).default : mod;
    if (Array.isArray(resolvedMods)) {
      this.mods.push(...resolvedMods);
    } else {
      this.mods.push(resolvedMods);
    }
    return this;
  };

  public use = (middleware: Middleware | string): this => {
    if (this.server) {
      throw Error('Can not use middleware after calling start');
    }
    const resolvedMiddleware =
      typeof middleware === 'string' ? require(require.resolve(middleware)).default : middleware;
    this.middlewares.push(resolvedMiddleware);
    return this;
  };
}
