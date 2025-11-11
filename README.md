# Ext-mcp

> 🧩 可扩展 MCP 框架 - Extendable MCP Framework

`Ext-mcp` 包含 `中间件` 和 `模组` 两个概念

- 中间件：用于承载通用能力，基于洋葱模型实现
- 模组：用于功能扩展，是 MCP 功能的集合 -- _功能指 MCP 协议中的 tool/prompt/resource_

```
 ┌─────────────────────────┐
 │   ext-mcp 请求处理流程    │
 └─────────────────────────┘
             ↓
       ╔═════════════╗
       ║ middleware1 ║
       ╚═════════════╝
             ↓
       ╔═════════════╗
       ║ middleware2 ║
       ╚═════════════╝
             ↓
╔═══════════════════════════╗
║           mods            ║
║ ┌─────┐  ┌─────┐  ┌─────┐ ║
║ │mod1 │  │mod2 │  │mod3 │ ║
║ └─────┘  └─────┘  └─────┘ ║
╚═══════════════════════════╝
             ↓
       ╔═════════════╗
       ║ middleware2 ║
       ╚═════════════╝
             ↓
       ╔═════════════╗
       ║ middleware1 ║
       ╚═════════════╝
```

## 快速上手

> 🌰 完整示例代码见 [demo](./demo/) 目录

### 安装

```bash
npm i ext-mcp
```

### app 入口

```typescript
import path from "path";
import XMCP from "ext-mcp";

import errorHandler from "./middlewares/error-handler";
import sayGoodbye from "./mods/say-goodbye";

const app = new XMCP({
  name: "my-mcp",
  version: "0.0.1",
});

// 🖇️ 中间件
app.use(path.join(__dirname, "./middlewares/logger")); // 基于文件
app.use(errorHandler); // 基于导入
// app.use(require.resolve('@foo/mcp-middleware-logger')); // 基于 npm/workspace 包

// 🧩 模组
app.installMod(path.join(__dirname, "./mods/say-hello")); // 基于文件
app.installMod(sayGoodbye); // 基于导入
// app.installMod(require.resolve('@foo/mcp-mod-demo')); // 基于 npm/workspace 包

// 启动服务，目前只支持 stdio 模式
app.start();
```

### 中间件定义

> 以实现一个 logger 中间件为例，在上下文中注入 logId 和 logger

```typescript
import { type Middleware } from "mcp";

export interface LoggerContext {
  logId: string;
  logger: {
    info: (message: string) => void;
    error: (message: string) => void;
  };
}

const middleware: Middleware<LoggerContext> = async (context, next) => {
  context.logId = `foo-log-id`;
  context.logger = createLogger(context.logId);
  context.logger.info(`mcp started: ${context.actionName}`);
  const res = await next();
  context.logger.info(`mcp finished: ${context.actionName}`);
  return res;
};

export default middleware;
```

### 模组定义

```typescript
import type { Mod, Tool } from "mcp";
import { z } from "zod/v3";

const sayHello: Tool<{ name: z.ZodString }> = {
  name: "say-hello",
  config: {
    title: "打个招呼吧",
    description: "用于 MCP 模组测试",
    inputSchema: { name: z.string().describe("用户名字") },
  },
  handler: (context) => {
    const { name } = context.args;
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${name}!`,
        },
      ],
    };
  },
};

const demoMod: Mod = {
  name: "demo-mod",
  version: "0.0.1",
  description: "示例模组",
  tools: [sayHello],
};

export default demoMod;
```

## 仓库开发

> 核心代码在 [src](./src/) 目录，使用示例在 [demo](./demo/) 目录

### 启动 mcp-demo 服务

```bash
# 安装依赖
npm install

# 启动调试工具。@see https://github.com/modelcontextprotocol/inspector
npx @modelcontextprotocol/inspector
```

服务启动后，`Command` 填入 `demo/run.sh` 的绝对路径，即可开始调试

### 配置 mcp-demo 服务

仓库中已经针对部分 IDE 做了配置，可直接在 IDE 中查看效果，配置文件:

- [claude-code - .mcp.json](.mcp.json)
- [cursor - .cursor/mcp.json](.cursor/mcp.json)
- [github-copilot - .vscode/mcp.json](.vscode/mcp.json`)
