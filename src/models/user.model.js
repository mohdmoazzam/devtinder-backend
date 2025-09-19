const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;

  return await bcrypt.compare(inputPassword, user.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
