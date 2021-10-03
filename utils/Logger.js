import chalk from "chalk";
import debug from "debug";
import dateFns from "date-fns";
import dotenv from "dotenv";

dotenv.config();

export class Logger {
  static latestTimeLog = 0;

  /* eslint-disable no-unused-vars */
  static externalLogService(msg, type) {
    // TODO: Send logs to azure application insights or similar.
  }
  /* eslint-enable no-unused-vars */

  static getTime() {
    return dateFns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  }

  static info(msg) {
    const time = this.getTime();
    const logMessage = `${time}: ${msg}`;
    this.development(logMessage, "info");
    this.externalLogService(logMessage, "info");
  }

  static warn(msg) {
    const time = this.getTime();
    const logMessage = `${time}: ${msg}`;
    this.development(logMessage, "warn");
    this.externalLogService(logMessage, "warn");
  }

  static error(msg) {
    const time = this.getTime();
    const logMessage = `${time}: ${msg}`;
    this.development(logMessage, "error");
    this.externalLogService(logMessage, "error");
  }

  static critical(msg) {
    const time = this.getTime();
    const logMessage = `${time}: ${msg}`;
    this.development(logMessage, "critical");
    this.externalLogService(logMessage, "critical");
  }

  static time(msg) {
    if (!process.env.DEBUG) return;

    if (!this.latestTimeLog) {
      this.development(chalk.inverse.bold(`Timelog: ${msg} +0ms`));
      this.latestTimeLog = Date.now();
    } else {
      const ms = Date.now() - this.latestTimeLog;
      this.development(chalk.inverse.bold(`Timelog: ${msg} +${ms}ms`));
      this.latestTimeLog = Date.now();
    }
  }

  static debug(msg) {
    const time = this.getTime();
    const logMessage = `${time}: ${msg}`;
    debug(logMessage);
  }

  static development(msg, type) {
    if (process.env.NODE_ENV !== "DEVELOPMENT") return;

    let message;
    switch (type) {
      case "critical":
        message = chalk.red.bold(`Critical: ${msg}`);
        break;
      case "error":
        message = chalk.red.bold(`Error: ${msg}`);
        break;
      case "warn":
        message = chalk.yellow.bold(`Warn: ${msg}`);
        break;
      case "info":
        message = chalk.white.bold(`Info: ${msg}`);
        break;
      default:
        message = msg;
    }

    /* eslint-disable-next-line no-console */
    console.info(message);
  }
}

const colorfulEndpoint = (msg) => {
  if (!msg || typeof msg !== "string") return msg;

  const [host, path] = msg.split(process.env.port);

  switch (msg) {
    case "GET":
      return chalk.blue.bold(msg, "  ");
    case "DELETE":
      return chalk.red.bold(msg);
    case "POST":
      return chalk.green.bold(msg, " ");
    case "PATCH":
      return chalk.yellow.bold(msg, "");
    default:
      return [chalk.inverse.bold(`${host}${process.env.port}`), chalk.magenta.bold(path)].join("");
  }
};

export const printEndpoints = (...routes) => {
  const ignoredMethods = ["HEAD"];
  Logger.development("\n ## ENDPOINTS ## \n");
  routes.forEach(({ stack: routerStack }) => {
    Logger.development(`\n # ${routerStack[0].opts.prefix.toUpperCase()} #`);
    routerStack.forEach((route) =>
      route.methods
        .filter((method) => !ignoredMethods.includes(method))
        .forEach((method) =>
          Logger.development(`${colorfulEndpoint(method)} #   ${colorfulEndpoint(`http://localhost:${process.env.port}${route.path}`)}`)
        )
    );
  });
};
