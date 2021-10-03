import koaLogger from "koa-logger";
import { Logger } from "../utils";

export const logger = () =>
  koaLogger((str, args) => {
    const [, method, path, statusCode, responseTime, size] = args;
    if (!statusCode) return;
    Logger.development(`${method} -> ${path} Status: ${statusCode} - ${size} in ${responseTime}`);
  });
