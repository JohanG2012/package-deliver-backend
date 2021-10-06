import Router from "@koa/router";
import Controller from "../controllers/cabinet.controller";

const controller = Controller();

const router = new Router({
  prefix: "/v1/cabinet",
});

router
  .get("/:id", controller.findOne)
  .post("/", controller.create)
  .get("/", controller.find)
  .delete("/:id", controller.deleteOne)
  .patch("/:id", controller.updateOne);

export default router;
