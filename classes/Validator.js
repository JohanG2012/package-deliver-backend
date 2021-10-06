import Joi from "joi";
import Boom from "@hapi/boom";
import ObjectId from "joi-objectid";

const JoiObjectId = ObjectId(Joi);
Joi.MongoObjectId = JoiObjectId;

const paginationSchema = Joi.object({
  next: Joi.MongoObjectId(),
  prev: Joi.MongoObjectId(),
});

const optionsSchema = Joi.object({
  sortBy: Joi.string(),
  limit: Joi.number().max(100).min(1),
  fields: Joi.array().items(Joi.string()),
});

const tokenSchema = Joi.object({
  user_id: Joi.MongoObjectId(),
});
export class Validator {
  constructor(data, schema) {
    this.data = data;
    this.schema = Joi.object({
      pagination: paginationSchema,
      options: optionsSchema,
      token: tokenSchema,
      input: Joi.object({
        params: Joi.object({ id: Joi.MongoObjectId() }).unknown(true),
        query: Joi.string(),
        body: schema,
      }),
    });
  }

  async validate() {
    try {
      const value = await this.schema.validateAsync(this.data, { abortEarly: false, stripUnknown: true });
      return value;
    } catch (e) {
      const errorMessage = e.details.reduce((a, b) => `${a}${a.length ? "," : ""}${b.message.replace(/['"]+/g, "")}`, "");
      /* eslint-disable-next-line new-cap */
      throw new Boom.badRequest(errorMessage);
    }
  }
}
