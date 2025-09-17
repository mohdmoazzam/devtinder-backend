const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
};

module.exports = {
  validateSignupData,
};
