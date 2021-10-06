import { PackageService as Service } from "../services";
import { ControllerBase } from "../classes";

const PackageController = () => {
  const controllerBase = ControllerBase(Service);
  const controller = {};

  return Object.assign(controllerBase, controller);
};

export default PackageController;
