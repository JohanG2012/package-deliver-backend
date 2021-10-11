import mongoose from "mongoose";
import Boom from "@hapi/boom";
import { Logger } from "./Logger";

export const errorHandler = (err, ctx, isCritical) => {
  if (isCritical) {
    const [rawErrorMessage] = err.stack.split("at");
    Logger.critical(`${rawErrorMessage} Stack trace: ${process.env.NODE_ENV === "DEVELOPMENT" ? err.stack : JSON.stringify(err.stack)}`);
  } else {
    Logger.development(`${ctx.status} - ${ctx.message}: ${ctx.body}`);
  }
};

export const mongooseErrorHandler = (e) => {
  if (e instanceof mongoose.Error || e.name.toLowerCase().includes("mongo")) {
    if (e.name === "ValidationError") {
      /* eslint-disable-next-line new-cap */
      throw new Boom.badRequest(e.message);
    } else if (e.message.toUpperCase().includes("E11000")) {
      const dupKey = e.message.split("dup key: ").pop();
      /* eslint-disable-next-line new-cap */
      throw new Boom.conflict(`Conflict due to duplicate resource or property: ${dupKey}`);
    } else {
      throw e;
    }
  } else {
    throw e;
  }
};

const isObject = (item) => item && typeof item === "object" && !Array.isArray(item);

export const mongooseResultHandler = (result) => {
  if (result?.deleteCount === 0 || result?.matchedCount === 0 || result === null) {
    /* eslint-disable-next-line new-cap */
    throw new Boom.notFound();
  }
};

export const serviceLauncher = (Service) => async (method, ctx) => {
  const service = new Service();
  if (!service.validators[method]) throw new Error("Validator is missing");
  const { params, query: queryParams, request, token } = ctx;
  const { prev, next, sortBy, query, limit, fields: queryFields } = queryParams;
  const { body } = request;
  const fields = queryFields?.replace(/ /g, "").split(",") ?? [];
  const pagination = {
    next,
    prev,
  };
  const options = {
    sortBy,
    limit,
    fields,
  };
  const input = {
    params,
    query,
    body,
  };
  const knownParams = [...Object.keys(options), ...Object.keys(pagination), ...Object.keys(input)];
  options.filters = Object.fromEntries(Object.entries(queryParams).filter((key) => !knownParams.includes(key)));
  const data = {
    pagination,
    token,
    options,
    input,
  };
  const Validator = new service.validators[method](data);
  const validInput = await Validator.validate();
  const value = await service[method](validInput);
  return value;
};

export const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
/* eslint-disable no-nested-ternary */
const stripObjectProps = (obj, propsArr) =>
  Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => {
        if (propsArr.includes(key)) return null;
        if (Array.isArray(value)) return [key, value.map((valueObj) => stripObjectProps(valueObj, propsArr))];
        if (isObject(value)) return [key, stripObjectProps(value, propsArr)];
        return [key, value];
      })
      .filter((x) => !!x)
  );

export const serializedObjProps = (input, stripArr) => {
  const deepCopy = JSON.parse(JSON.stringify(input));
  if (Array.isArray(input)) {
    return deepCopy.map((obj) => stripObjectProps(obj, stripArr));
  }
  return stripObjectProps(deepCopy, stripArr);
};

export function findKeys(schema) {
  return schema._inner.children.reduce((acc, child) => {
    let newAcc = acc.concat([child.key]);
    if (child.schema._type === "object") {
      const childKeys = findKeys(child.schema);
      newAcc = newAcc.concat(childKeys.map((key) => `${child.key}.${key}`));
    }

    return newAcc;
  }, []);
}

export const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return deepMerge(target, ...sources);
};

export const partialSchema = (schema) => schema.optionalKeys(...findKeys(schema));

export * from "./Logger";
