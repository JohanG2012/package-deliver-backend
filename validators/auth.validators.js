/* eslint-disable max-classes-per-file */
import Joi from "joi";
import { Validator } from "../classes";
import { userSchema } from "./user.validators";

export class loginValidator extends Validator {
  constructor(data) {
    super(data, userSchema);
  }
}

export class rotateValidator extends Validator {
  constructor(data) {
    super(data, Joi.object({}));
  }
}
