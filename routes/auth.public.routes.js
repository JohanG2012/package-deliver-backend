import Router from "@koa/router";
import Controller from "../controllers/auth.controller";

const controller = Controller();

const router = new Router({
  prefix: "/v1/public/auth",
});

router.post("/login", controller.login);

export default router;
