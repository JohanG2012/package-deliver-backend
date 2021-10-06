import { createCabinetValidator, findCabinetValidator, updateCabinetValidator, deleteCabinetValidator } from "../validators";
import { Cabinet } from "../models";
import { Service } from "../classes";

export class CabinetService extends Service {
  constructor() {
    const validators = {
      create: createCabinetValidator,
      find: findCabinetValidator,
      findOne: findCabinetValidator,
      deleteOne: deleteCabinetValidator,
      updateOne: updateCabinetValidator,
    };
    super(validators, Cabinet);
  }
}
