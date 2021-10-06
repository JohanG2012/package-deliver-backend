import mongoose from "mongoose";
import joigoose from "joigoose";
import { packageSchema } from "../validators";

const Joigoose = joigoose(mongoose);

const mongoosePackageSchema = new mongoose.Schema(Joigoose.convert(packageSchema), { timestamps: true });

export const Package = mongoose.model("Package", mongoosePackageSchema);
