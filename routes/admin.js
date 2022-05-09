const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/admin");
const { isLoggedIn, checkProfileOwner } = require("../middleware");

router.route("/admin").get(users.userAdmin);

module.exports = router;
