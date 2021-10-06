import Router from "@koa/router";
import Controller from "../controllers/package.controller";

const controller = Controller();

const router = new Router({
  prefix: "/v1/package",
});

router
  .get("/:id", controller.findOne)
  .post("/", controller.create)
  .get("/", controller.find)
  .delete("/:id", controller.deleteOne)
  .patch("/:id", controller.updateOne);

export default router;
