const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(process.env.DATABASE_URI);
};

module.exports = connectToDatabase;
