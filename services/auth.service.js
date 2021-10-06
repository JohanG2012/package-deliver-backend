import Boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import { loginValidator, rotateValidator } from "../validators";
import { User } from "../models";
import { mongooseErrorHandler, mongooseResultHandler } from "../utils";

export class AuthService {
  constructor() {
    this.validators = {
      login: loginValidator,
      rotate: rotateValidator,
    };
    this.Model = User;
  }

  async getRefreshToken() {
    // For better secruity should be implemented, but limited time.
  }

  async login({ input }) {
    try {
      const user = await this.Model.findOne({ email: input.body.email }).exec();
      mongooseResultHandler(user);
      user.comparePassword(input.body.password, (error, match) => {
        if (error) {
          throw error;
        }
        if (!match) {
          /* eslint-disable-next-line new-cap */
          throw new Boom.badRequest("The password is invalid");
        }
      });
      const TWO_HOURS = 7200000;
      return {
        access_token: jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        }),
        expires_in: Date.now() + TWO_HOURS,
        refresh_token: this.getRefreshToken(),
      };
    } catch (error) {
      return mongooseErrorHandler(error);
    }
  }

  async rotate() {
    // For better secruity should be implemented, but limited time.
  }
}
