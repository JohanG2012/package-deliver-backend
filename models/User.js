/* eslint-disable func-names */
import mongoose from "mongoose";
import joigoose from "joigoose";
import Bcrypt from "bcryptjs";
import { userSchema } from "../validators";

const Joigoose = joigoose(mongoose);

const mongooseUserSchema = new mongoose.Schema(Joigoose.convert(userSchema), { timestamps: true });

mongooseUserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = Bcrypt.hashSync(this.password, 10);
  return next();
});

mongooseUserSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, Bcrypt.compareSync(plaintext, this.password));
};

export const User = mongoose.model("User", mongooseUserSchema);
