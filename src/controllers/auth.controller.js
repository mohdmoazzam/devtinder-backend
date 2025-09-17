const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    validateSignupData(req.body);

    const emailExists = await User.findOne({
      email: email,
    });
    if (emailExists) {
      res.status(400).send({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    user.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Invalid request data",
    });
  }
};

const login = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    validateSignupData(req.body);

    const emailExists = await User.findOne({
      email: email,
    });
    if (emailExists) {
      res.status(400).send({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    user.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Invalid request data",
    });
  }
};

module.exports = {
  signup,
  login,
};
