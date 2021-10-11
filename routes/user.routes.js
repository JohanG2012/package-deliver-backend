import Router from "@koa/router";
import Controller from "../controllers/user.controller";

const controller = Controller();

const router = new Router({
  prefix: "/v1/user",
});

// prettier-ignore
router
  .get("/:id", controller.findOne)
  .get("/", controller.find)
  .delete("/:id", controller.deleteOne)
  .patch("/:id", controller.updateOne);

export default router;
