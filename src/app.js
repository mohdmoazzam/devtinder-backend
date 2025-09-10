require("dotenv").config();
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.info(`*** Server is up & running on port ${PORT} ***`);
});
