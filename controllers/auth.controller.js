import { AuthService as Service } from "../services";
import { serviceLauncher } from "../utils";

const AuthController = () => {
  const controller = {};
  const launcher = serviceLauncher(Service);

  controller.login = async (ctx, next) => {
    ctx.body = await launcher("login", ctx);
    ctx.status = 200;
    next();
  };

  controller.rotate = async (ctx, next) => {
    ctx.body = await launcher("rotate", ctx);
    ctx.status = 200;
    next();
  };

  return controller;
};

export default AuthController;
