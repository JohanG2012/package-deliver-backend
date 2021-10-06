import Boom from "@hapi/boom";
import { createPackageValidator, findPackageValidator, updatePackageValidator, deletePackageValidator } from "../validators";
import { Package } from "../models";
import { Service } from "../classes";
import { mongooseErrorHandler, mongooseResultHandler } from "../utils";
import { CabinetService } from ".";

export class PackageService extends Service {
  constructor() {
    const validators = {
      create: createPackageValidator,
      find: findPackageValidator,
      findOne: findPackageValidator,
      deleteOne: deletePackageValidator,
      updateOne: updatePackageValidator,
    };
    super(validators, Package);
  }

  async create({ input, token }) {
    try {
      const cabinetService = new CabinetService();
      const cabinet = await cabinetService.findOne({
        options: {
          fields: [],
          filter: {
            $near: {
              $maxDistance: 5000,
              $geometry: { type: "Point", coordinates: [input.body.address.loc.x, input.body.address.loc.y] },
            },
          },
        },
      });
      mongooseResultHandler(cabinet);
      const doc = new this.Model({ ...input.body, carrier: token.user_id });
      const result = await doc.save();
      mongooseResultHandler(result);
      // Should be improved to find locker that fits best for the package.
      const lockerIndex = cabinet.lockers.findIndex(
        (locker) =>
          !locker.allocated &&
          locker.width > input.body.dimension.width &&
          locker.depth > input.body.dimension.depth &&
          locker.height > input.body.dimension.height
      );
      /* eslint-disable-next-line new-cap */
      if (lockerIndex < 0) throw new Boom.notFound();
      cabinet.lockers[lockerIndex] = { allocated: result._id, ...JSON.parse(JSON.stringify(cabinet.lockers[lockerIndex])) };
      const savedCabinet = await cabinetService.updateOne({ input: { params: { id: cabinet._id }, body: cabinet } });
      mongooseResultHandler(savedCabinet);
      return result;
    } catch (e) {
      return mongooseErrorHandler(e);
    }
  }
}
