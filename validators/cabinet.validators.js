/* eslint-disable max-classes-per-file */
import Joi from "joi";
import ObjectId from "joi-objectid";
import mongoose from "mongoose";
import { Validator } from "../classes";

const MObjectId = mongoose.Schema.Types.ObjectId;

const JoiObjectId = ObjectId(Joi);
Joi.MongoObjectId = JoiObjectId;

const locSchema = Joi.object({
  x: Joi.number().required(),
  y: Joi.number().required(),
});

const partialLocSchema = Joi.object({
  x: Joi.number(),
  y: Joi.number(),
});

const addressSchema = Joi.object({
  street: Joi.string().required(),
  zipcode: Joi.string().required(),
  city: Joi.string().required(),
  loc: locSchema,
});

const partialAddressSchema = Joi.object({
  street: Joi.string(),
  zipcode: Joi.string(),
  city: Joi.string(),
  loc: partialLocSchema,
});

const lockerSchema = Joi.object({
  height: Joi.number().required(),
  width: Joi.number().required(),
  depth: Joi.number().required(),
  allocated: Joi.any().meta({ _mongoose: { type: MObjectId } }),
});

const partialLockerSchema = Joi.object({
  height: Joi.number(),
  width: Joi.number(),
  depth: Joi.number(),
  allocated: Joi.any().meta({ _mongoose: { type: MObjectId } }),
});

export const cabinetSchema = Joi.object({
  address: addressSchema,
  lockers: Joi.array().items(lockerSchema).max(16).min(1),
});

export const partialCabinetSchema = Joi.object({
  address: partialAddressSchema,
  lockers: Joi.array().items(partialLockerSchema).max(16).min(1),
});

export class createCabinetValidator extends Validator {
  constructor(data) {
    super(data, cabinetSchema);
  }
}

export class updateCabinetValidator extends Validator {
  constructor(data) {
    super(data, partialCabinetSchema);
  }
}

export class findCabinetValidator extends Validator {
  constructor(data) {
    super(data, Joi.object({}));
  }
}

export class deleteCabinetValidator extends Validator {
  constructor(data) {
    super(data, Joi.object({}));
  }
}
