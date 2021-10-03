const getAllowedOrigin = (origin) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(" ") || [];
  return allowedOrigins.includes(origin) ? origin : null;
};

export const allowCORS = async (ctx, next) => {
  const allowCors = process.env.NODE_ENV === "DEVELOPMENT" || process.env.ALLOW_CORS;
  ctx.set("Access-Control-Allow-Origin", allowCors ? "*" : getAllowedOrigin(ctx.request.headers.origin));
  ctx.set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
  ctx.set("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE, OPTIONS");
  await next();
};
