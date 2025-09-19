const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { getUserProfile, updateUserProfile, getUserConnections, getUsers } = require("../controllers/users.controller");

const router = express.Router();

router.get("/profile", userAuth, getUserProfile);
router.patch("/profile", userAuth, updateUserProfile);

router.get("/connections", userAuth, getUserConnections);
router.get("/", userAuth, getUsers);

module.exports = router;
