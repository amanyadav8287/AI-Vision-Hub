const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name must be at most 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email is invalid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never return by default
    },
    profileImage: {
      type: String,
      default: "",
    },
    settings: {
      language: { type: String, default: "en" },
      defaultMode: {
        type: String,
        enum: ["product", "plant", "food", "electronics", "document"],
        default: "plant",
      },
      notifications: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before save
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: compare candidate with stored hash
userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) {
    // Load password explicitly if it was excluded
    const full = await this.constructor.findById(this._id).select("+password");
    if (!full || !full.password) return false;
    return bcrypt.compare(candidate, full.password);
  }
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
