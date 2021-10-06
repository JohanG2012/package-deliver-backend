import Koa from "koa";
import dotenv from "dotenv";
import rateLimit from "koa-ratelimit";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";
import { privateRouter, publicRouter } from "./routes";
import { emitError, forceHTTPS, allowCORS, contentValidation, networkLogger, logger, responseLogger, formatResponse } from "./middlewares";
import { parserConfig, rateLimitConfig } from "./configs";
import { errorHandler, Logger } from "./utils";
import { connect } from "./models";

dotenv.config();
const app = new Koa();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/db";
await connect(MONGODB_URI, Logger.critical);
app
  /* eslint-disable-next-line no-return-assign */
  .use((ctx, next) => (ctx.env = app.env) && next())
  .use(responseLogger)
  .use(formatResponse)
  .use(emitError)
  .use(forceHTTPS())
  .use(allowCORS)
  .use(contentValidation)
  .use(bodyParser(parserConfig))
  .use(logger())
  .use(publicRouter())
  .use(jwt({ secret: process.env.JWT_SECRET }).unless({ path: [/^\/public/] }))
  .use(privateRouter())
  .use(networkLogger)
  .use(rateLimit(rateLimitConfig));
app.listen(PORT, () => {
  Logger.development(`Server started on port: ${PORT}`);
});

app.on("error", errorHandler);
