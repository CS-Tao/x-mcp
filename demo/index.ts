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
