const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { success, error } = require("../utils/response");
const { AppError } = require("../middleware/errorMiddleware");

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return obj;
}

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return error(res, {
        message: "Email is already registered",
        statusCode: 409,
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return success(res, {
      statusCode: 201,
      message: "Account created successfully",
      data: { user: sanitizeUser(user), token },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    console.log("[login] email:", email);
    console.log("[login] user found:", !!user);

    if (!user) {
      console.log("[login] USER NOT FOUND");

      return error(res, {
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    console.log("[login] password hash exists:", !!user.password);

    const isMatch = await user.comparePassword(password);

    console.log("[login] password match:", isMatch);

    if (!isMatch) {
      console.log("[login] PASSWORD DOES NOT MATCH");

      return error(res, {
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    const token = generateToken(user._id);

    return success(res, {
      message: "Logged in successfully",
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Requires authMiddleware.
 */
async function me(req, res, next) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    return success(res, {
      data: sanitizeUser(req.user),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
