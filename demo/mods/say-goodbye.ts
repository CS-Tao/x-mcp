import type { Mod, Tool } from "ext-mcp";
import { z } from "zod/v3";

import { LoggerContext } from "../middlewares/logger";

type Args = {
  name: z.ZodOptional<z.ZodString>;
};

const schema = {
  name: z.optional(z.string()).describe("用户名字"),
};

const sayGoodbye: Tool<Args, LoggerContext> = {
  name: "say-goodbye",
  config: {
    title: "告个别吧",
    description: "用于 MCP 模组测试",
    inputSchema: schema,
  },
  handler: (context) => {
    context.logger.info(
      "say-goodbye",
      `goodbye to ${context.args.name || "Guest"}`
    );
    return {
      content: [
        {
          type: "text",
          text: `Goodbye, ${context.args.name || "Guest"}!`,
        },
      ],
    };
  },
};

const goodbyeMod: Mod = {
  name: "goodbye-mod",
  version: "0.0.1",
  description: "示例模组 - 告别",
  tools: [
    sayGoodbye,
    // ... add more tools here
  ],
};

export default goodbyeMod;
