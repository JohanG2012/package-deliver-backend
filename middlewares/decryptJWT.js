import jwt from "jsonwebtoken";

export const decryptJWT = (ctx, next) => {
  const token = ctx.request.headers.authorization?.split(" ")?.pop();
  if (!token) return next();
  ctx.token = jwt.decode(token, { complete: true }).payload;
  return next();
};
