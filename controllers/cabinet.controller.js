import { CabinetService as Service } from "../services";
import { ControllerBase } from "../classes";

const CabinetController = () => {
  const controllerBase = ControllerBase(Service);
  const controller = {};

  return Object.assign(controllerBase, controller);
};

export default CabinetController;
