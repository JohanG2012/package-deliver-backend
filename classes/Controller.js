import { serviceLauncher } from "../utils";

export const ControllerBase = (Service) => {
  const controller = {};
  const launcher = serviceLauncher(Service);

  controller.findOne = async (ctx, next) => {
    ctx.body = await launcher("findOne", ctx);
    ctx.status = 200;
    next();
  };

  controller.find = async (ctx, next) => {
    ctx.body = await launcher("find", ctx);
    ctx.status = 200;
    next();
  };

  controller.deleteOne = async (ctx, next) => {
    ctx.body = await launcher("deleteOne", ctx);
    ctx.status = 204;
    next();
  };

  controller.updateOne = async (ctx, next) => {
    ctx.body = await launcher("updateOne", ctx);
    ctx.status = 200;
    next();
  };

  controller.create = async (ctx, next) => {
    ctx.body = await launcher("create", ctx);
    ctx.status = 201;
    next();
  };

  return controller;
};
