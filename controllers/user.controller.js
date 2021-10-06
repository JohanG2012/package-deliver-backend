import { UserService as Service } from "../services";
import { ControllerBase } from "../classes";
import { serviceLauncher } from "../utils";

const UserController = () => {
  const controllerBase = ControllerBase(Service);
  const controller = {};
  const launcher = serviceLauncher(Service);
  controller.create = async (ctx, next) => {
    ctx.body = await launcher("create", ctx);
    ctx.status = 204;
    next();
  };

  return Object.assign(controllerBase, controller);
};

export default UserController;
