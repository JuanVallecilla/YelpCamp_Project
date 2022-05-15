const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/admin");
const admin = require("../controllers/admin");
const { isLoggedIn, checkProfileOwner, isAdmin, validateEditUser, validateEditAdmin } = require("../middleware");

router.route("/admin").get(isLoggedIn, isAdmin, catchAsync(admin.userAdmin));

// router.route("/users/:id").put(isAdmin, validateEditAdmin, catchAsync(admin.updateAdmin));

module.exports = router;
