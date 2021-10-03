export const forceHTTPS =
  (port, hostname, httpStatusCode = 301) =>
  (ctx, next) => {
    if (ctx.secure || process.env.NODE_ENV === "DEVELOPMENT") return next();

    const urlRedirect = ctx.request.URL;
    urlRedirect.protocol = "https";
    if (port) urlRedirect.port = port;
    if (hostname) urlRedirect.hostname = hostname;

    ctx.response.status = httpStatusCode;
    ctx.response.redirect(urlRedirect.href);
    return next();
  };
