require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./config/database");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

connectToDatabase()
  .then(() => {
    console.info("*** Successfully connected to Database ***");
    app.listen(PORT, () => {
      console.info(`*** Server is up & running on port ${PORT} ***`);
    });
  })
  .catch((err) => {
    console.error("*** Failed to connect to Database ***", err);
    process.exit(1);
  });
