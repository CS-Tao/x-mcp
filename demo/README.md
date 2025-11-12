[![Test](https://github.com/CS-Tao/x-mcp/actions/workflows/test.yml/badge.svg)](https://github.com/CS-Tao/x-mcp/actions/workflows/test.yml)

# EXT-MCP DEMO

> 🌰 ext-mcp 使用示例

## 启动 demo 服务

```bash
# 安装依赖
npm install

# 启动调试工具。@see https://github.com/modelcontextprotocol/inspector
npx @modelcontextprotocol/inspector
```

服务启动后，`Command` 填入 `demo/run.sh` 的绝对路径，即可开始调试

## 配置 demo 服务到 IDE

仓库中已经针对部分 IDE 做了配置，可直接在 IDE 中查看效果，配置文件:

- [claude-code - .mcp.json](../.mcp.json)
- [cursor - .cursor/mcp.json](../.cursor/mcp.json)
- [github-copilot - .vscode/mcp.json](../.vscode/mcp.json`)
