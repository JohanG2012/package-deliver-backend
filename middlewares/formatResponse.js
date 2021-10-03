export const formatResponse = async (ctx, next) => {
  await next();
  const isSuccess = ctx.status < 300;
  if ((isSuccess && !ctx.body) || (!isSuccess && !ctx.messages)) return;
  const status = isSuccess ? "success" : "error";
  let data;
  let messages;
  if (isSuccess) {
    data = ctx.body;
  } else {
    messages = Array.isArray(ctx.messages) ? ctx.messages : ctx.messages.split(",");
  }
  const response = { status, data, messages };
  ctx.body = JSON.stringify(response);
};
