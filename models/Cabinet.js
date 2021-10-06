import mongoose from "mongoose";
import joigoose from "joigoose";
import { cabinetSchema } from "../validators";

const Joigoose = joigoose(mongoose);

const mongooseCabinetSchema = new mongoose.Schema(Joigoose.convert(cabinetSchema), { timestamps: true });

export const Cabinet = mongoose.model("Cabinet", mongooseCabinetSchema);
