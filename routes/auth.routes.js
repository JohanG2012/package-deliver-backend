import Router from "@koa/router";
import Controller from "../controllers/auth.controller";

const controller = Controller();

const router = new Router({
  prefix: "/v1/auth",
});

router.get("/rotate", controller.login);

export default router;
