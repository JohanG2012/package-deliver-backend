export const emitError = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err?.isBoom) {
      ctx.status = err.output.statusCode;
      ctx.messages = err.message || "Something went wrong!";
      ctx.app.emit("error", err, ctx);
    } else {
      ctx.status = err.status || 500;
      ctx.messages = err.status ? err.message : "Internal Server Error";
      ctx.app.emit("error", err, ctx, !err.status);
    }
  }
};
