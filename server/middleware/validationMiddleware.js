const { validationResult } = require("express-validator");
const { error } = require("../utils/response");

/**
 * Run after an express-validator chain to convert validation failures
 * into a standardized 400 response.
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({
      field: e.path || e.param,
      message: e.msg,
    }));
    return error(res, {
      message: "Validation failed",
      statusCode: 400,
      errors,
    });
  }
  next();
}

module.exports = validate;
