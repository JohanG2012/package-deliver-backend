export const contentValidation = async (ctx, next) => {
  const validContentType = ctx.is("application/json") || ctx.is("application/json") === null;
  if (!validContentType) ctx.throw(415, "Content-Type header must be set and must be application/json");
  if (!ctx.accepts("application/json")) ctx.throw(406, "API only supports application/json");
  await next();
};
