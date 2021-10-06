import Router from "@koa/router";
import Controller from "../controllers/user.controller";

const controller = Controller();

const router = new Router({
  prefix: "/v1/public/user",
});

router.post("/", controller.create);

export default router;
