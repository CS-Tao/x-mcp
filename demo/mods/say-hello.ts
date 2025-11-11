import type { Mod, Tool } from "ext-mcp";
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

    if (!name || name.trim() === "") {
      throw new Error("名字不能为空");
    }

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

const helloMod: Mod = {
  name: "hello-mod",
  version: "0.0.1",
  description: "示例模组 - 打招呼",
  tools: [
    sayHello,
    // ... add more tools here
  ],
};

export default helloMod;
