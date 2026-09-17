const User = require("../models/User");
const Favorite = require("../models/Favorite");
const scanService = require("../services/scanService");
const { success } = require("../utils/response");

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return obj;
}

/**
 * GET /api/users/profile
 */
async function getProfile(req, res, next) {
  try {
    return success(res, { data: sanitizeUser(req.user) });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/profile
 * Update name and/or profile image.
 */
async function updateProfile(req, res, next) {
  try {
    const updates = {};
    if (typeof req.body.name === "string" && req.body.name.trim()) {
      updates.name = req.body.name.trim();
    }
    if (typeof req.body.profileImage === "string") {
      updates.profileImage = req.body.profileImage;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    return success(res, {
      message: "Profile updated",
      data: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/settings
 */
async function getSettings(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("settings");
    return success(res, { data: { settings: user.settings } });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/settings
 */
async function updateSettings(req, res, next) {
  try {
    const updates = {};
    if (req.body.language !== undefined) updates["settings.language"] = req.body.language;
    if (req.body.defaultMode !== undefined) updates["settings.defaultMode"] = req.body.defaultMode;
    if (req.body.notifications !== undefined)
      updates["settings.notifications"] = req.body.notifications;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("settings");

    return success(res, {
      message: "Settings updated",
      data: { settings: user.settings },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/dashboard
 * Returns aggregate statistics for the authenticated user.
 */
async function dashboard(req, res, next) {
  try {
    const stats = await scanService.dashboardStats(req.user._id);
    const savedScans = await Favorite.countDocuments({ userId: req.user._id });
    return success(res, {
      data: {
        ...stats,
        savedScans,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  dashboard,
};
