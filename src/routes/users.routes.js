const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { getUserProfile } = require("../controllers/users.controller");

const router = express();

router.get("profile", userAuth, getUserProfile);
