const express = require("express");
const { signup, login } = require("../controllers/auth.controller");

const router = express();

router.post("/signup", signup);
router.post("/login", login);
