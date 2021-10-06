const isValidJson = (data) => {
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    return false;
  }
  const isArrayWithData = Array.isArray(parsed) && parsed.length;
  const isObjectWithData = parsed instanceof Object && parsed !== null && Object.keys(parsed).length;
  return isArrayWithData || isObjectWithData;
};

export const parserConfig = {
  enableTypes: ["json"],
  jsonLimit: "1mb",
  onerror: (err, ctx) => {
    if (!isValidJson(ctx.request.body)) ctx.throw(400, "Invalid JSON. Must be object or array. Can't be empty.");
  },
};
