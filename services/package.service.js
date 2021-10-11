import Boom from "@hapi/boom";
import { createPackageValidator, findPackageValidator, updatePackageValidator, deletePackageValidator } from "../validators";
import { Package } from "../models";
import { Service } from "../classes";
import { mongooseErrorHandler, mongooseResultHandler } from "../utils";
import { CabinetService } from "./cabinet.service";

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
      const cabinets = await cabinetService.find({
        options: {
          fields: [],
          limit: 100,
          filter: {
            "lockers.allocated": null,
            $near: {
              $maxDistance: 5000,
              $geometry: { type: "Point", coordinates: [input.body.address.loc.x, input.body.address.loc.y] },
            },
          },
        },
      });
      mongooseResultHandler(cabinets);
      const doc = new this.Model({ ...input.body, carrier: token.user_id });
      const result = await doc.save();
      mongooseResultHandler(result);
      // Should be improved to find locker that fits best for the package.
      let found;
      let lockerIndex;
      cabinets.result.some((cabinet) => {
        lockerIndex = cabinet.lockers.findIndex(
          (locker) =>
            !locker.allocated &&
            locker.width > input.body.dimension.width &&
            locker.depth > input.body.dimension.depth &&
            locker.height > input.body.dimension.height
        );

        if (lockerIndex >= 0) {
          found = cabinet;
          return true;
        }
        return false;
      });
      if (!found) {
        /* eslint-disable-next-line new-cap */
        throw new Boom.notFound();
      }
      found.lockers[lockerIndex] = { allocated: result._id, ...JSON.parse(JSON.stringify(found.lockers[lockerIndex])) };
      const savedCabinet = await cabinetService.updateOne({ input: { params: { id: found._id }, body: found } });
      mongooseResultHandler(savedCabinet);
      return result;
    } catch (e) {
      return mongooseErrorHandler(e);
    }
  }
}
