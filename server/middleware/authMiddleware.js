const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const { error } = require("../utils/response");

/**
 * JWT authentication middleware.
 * Reads the Authorization: Bearer <token> header, verifies it,
 * attaches the user to req.user.
 */
async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return error(res, {
        message: "Unauthorized: no token provided",
        statusCode: 401,
      });
    }

    const token = header.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      const msg =
        err.name === "TokenExpiredError"
          ? "Unauthorized: token expired"
          : "Unauthorized: invalid token";
      return error(res, { message: msg, statusCode: 401 });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return error(res, {
        message: "Unauthorized: user no longer exists",
        statusCode: 401,
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
