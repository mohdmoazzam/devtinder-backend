const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { sendRequest, reviewRequest, getReceivedRequests } = require("../controllers/request.controller");

const router = express.Router();

router.post("/send", userAuth, sendRequest);
router.post("/review", userAuth, reviewRequest);

router.get("/received", userAuth, getReceivedRequests);

module.exports = router;
