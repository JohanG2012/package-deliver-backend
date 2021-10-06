import mongoose from "mongoose";

mongoose.Promise = global.Promise;

export const connect = async (uri, errorHandler) => {
  if (process.env.NODE_ENV === "PRODUCTION" || process.env.NODE_ENV === "DEVELOPMENT") {
    try {
      await mongoose.connect(uri);
    } catch (e) {
      errorHandler(e);
    }
  }
};

export * from "./User";
export * from "./Cabinet";
export * from "./Package";
