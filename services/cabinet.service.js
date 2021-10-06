import { createCabinetValidator, findCabinetValidator, updateCabinetValidator, deleteCabinetValidator } from "../validators";
import { Cabinet } from "../models";
import { Service } from "../classes";
import { mongooseErrorHandler, mongooseResultHandler } from "../utils";

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

  async create({ input, token }) {
    try {
      const doc = new this.Model({ ...input.body, carrier: token.user_id });
      const result = await doc.save();
      mongooseResultHandler(result);
      return result;
    } catch (e) {
      return mongooseErrorHandler(e);
    }
  }
}
