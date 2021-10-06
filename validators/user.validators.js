/* eslint-disable max-classes-per-file */
import Joi from "joi";
import { Validator } from "../classes";

const passwordRequirements = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/);
const stringPassswordError =
  "Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length. Maximum 32 in length";
export const userSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .meta({ _mongoose: { unique: true } }),
  password: Joi.string().regex(passwordRequirements).message(stringPassswordError).required(),
});

export class createUserValidator extends Validator {
  constructor(data) {
    super(data, userSchema);
  }
}

export class updateUserValidator extends Validator {
  constructor(data) {
    super(
      data,
      Joi.object({
        email: Joi.string()
          .email()
          .meta({ _mongoose: { unique: true } }),
        password: Joi.string().regex(passwordRequirements).message(stringPassswordError),
      })
    );
  }
}

export class findUserValidator extends Validator {
  constructor(data) {
    super(data, Joi.object({}));
  }
}

export class deleteUserValidator extends Validator {
  constructor(data) {
    super(data, Joi.object({}));
  }
}
