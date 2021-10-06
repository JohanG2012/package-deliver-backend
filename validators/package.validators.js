/* eslint-disable max-classes-per-file */
import Joi from "joi";
import mongoose from "mongoose";
import { Validator } from "../classes";

const MObjectId = mongoose.Schema.Types.ObjectId;

const locSchema = Joi.object({
  x: Joi.number().required(),
  y: Joi.number().required(),
});

const dimensionSchema = Joi.object({
  height: Joi.number().required(),
  depth: Joi.number().required(),
  width: Joi.number().required(),
});

const addressSchema = Joi.object({
  street: Joi.string().required(),
  zipcode: Joi.string().required(),
  city: Joi.string().required(),
  phone: Joi.string().required(),
  loc: locSchema,
});

export const packageSchema = Joi.object({
  carrier: Joi.any().meta({ _mongoose: { type: MObjectId } }),
  address: addressSchema,
  dimension: dimensionSchema,
});

export class createPackageValidator extends Validator {
  constructor(data) {
    super(data, packageSchema);
  }
}

export class updatePackageValidator extends Validator {
  constructor(data) {
    super(
      data,
      Joi.object(packageSchema)
    );
  }
}

export class findPackageValidator extends Validator {
  constructor(data) {
    super(data, Joi.object({}));
  }
}

export class deletePackageValidator extends Validator {
  constructor(data) {
    super(data, Joi.object({}));
  }
}
