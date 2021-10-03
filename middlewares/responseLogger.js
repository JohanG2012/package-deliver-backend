import { Logger } from "../utils";

export const responseLogger = async (ctx, next) => {
  await next();
  if (ctx.env !== "DEVELOPMENT") return;
  Logger.development("## RESPONSE SENT ##");
  Logger.development({ status: ctx.status, body: ctx.body ? JSON.parse(ctx.body) : null });
};
