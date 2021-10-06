import mongoose from "mongoose";
import { mongooseResultHandler, mongooseErrorHandler } from "../utils";

export class Service {
  constructor(validators, model) {
    this.validators = validators;
    this.limit = 20;
    this.Model = model;
  }

  async create({ input }) {
    try {
      const doc = new this.Model(input.body);
      const result = await doc.save();
      mongooseResultHandler(result);
      return result;
    } catch (e) {
      return mongooseErrorHandler(e);
    }
  }

  async find({ pagination, options }) {
    try {
      const fields = Object.fromEntries(options.fields.map((key) => [key, 1]));
      const query = options.filter || {};
      if (pagination.next) {
        query._id = { $lt: mongoose.Types.ObjectId(pagination.next) };
      }
      if (pagination.prev) {
        query._id = { $gt: mongoose.Types.ObjectId(pagination.prev) };
      }
      const result = await this.Model.find(query)
        .limit(options.limit || this.limit)
        .select(fields)
        .sort(options.sort || "_id");
      mongooseResultHandler(result);
      return {
        result,
        has_more: result.length === (options.limit || this.limit),
        next: result.length === (options.limit || this.limit) ? result[result.length - 1]._id : null,
      };
    } catch (e) {
      return mongooseErrorHandler(e);
    }
  }

  async findOne({ options, input }) {
    try {
      const fields = Object.fromEntries(options.fields.map((key) => [key, 1]));
      const query = options.filter || { _id: input.params.id };
      const result = await this.Model.findOne(query).select(fields);
      mongooseResultHandler(result);
      return result;
    } catch (e) {
      return mongooseErrorHandler(e);
    }
  }

  async deleteOne({ input }) {
    try {
      const query = { _id: input.params.id };

      const result = await this.Model.deleteOne(query);
      mongooseResultHandler(result);
      return result;
    } catch (e) {
      return mongooseErrorHandler(e);
    }
  }

  async updateOne({ input }) {
    try {
      const query = { _id: input.params.id };

      const result = await this.Model.updateOne(query, { $set: input.body });
      mongooseResultHandler(result);
      return result;
    } catch (e) {
      return mongooseErrorHandler(e);
    }
  }
}
