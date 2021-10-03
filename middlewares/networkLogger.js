import { Logger } from "../utils";

export const networkLogger = async (ctx, next) => {
  await next();
  if (ctx.response.status === 429) {
    Logger.critical(`Network spam from ip: ${ctx.ip} on path: ${ctx.request.path} Request headers: ${JSON.stringify(ctx.request.headers)}`);
  }
};
