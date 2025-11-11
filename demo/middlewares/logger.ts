import fs from "fs";
import path from "path";
import { type Middleware } from "ext-mcp";

export interface LoggerContext {
  logId: string;
  logger: {
    filePath: string;
    info: (tag: string, message: string) => void;
    error: (tag: string, message: string) => void;
  };
}

const filePath = path.join(__dirname, "..", "mcp.log");

const createLogger = (logId: string) => {
  return {
    filePath,
    info: (tag: string, message: string) => {
      fs.appendFileSync(
        filePath,
        `${new Date().toISOString()} INFO [${logId}] ${tag} - ${message}\n`
      );
    },
    error: (tag: string, message: string) => {
      fs.appendFileSync(
        filePath,
        `${new Date().toISOString()} ERROR [${logId}] ${tag} - ${message}\n`
      );
    },
  };
};

const loggerMiddleware: Middleware<LoggerContext> = async (context, next) => {
  context.logId = `foo-log-id`;
  context.logger = createLogger(context.logId);
  context.logger.info("logger", `mcp started: ${context.actionName}`);
  const res = await next();
  context.logger.info("logger", `mcp finished: ${context.actionName}`);
  return res;
};

export default loggerMiddleware;
