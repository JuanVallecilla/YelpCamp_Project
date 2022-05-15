const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const admin = require("../controllers/admin");

const { isLoggedIn, checkProfileOwner, validateEditUser, validateUserRegister, isAdmin, validateEditAdmin } = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
// Grouping similar routes together that have the same path.
router.route("/register").get(users.renderRegister).post(upload.single("avatar"), validateUserRegister, catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);

router.get("/logout", users.logout);

router
  .route("/users/:id")
  .get(isLoggedIn, catchAsync(users.userProfile))
  .put(isLoggedIn, checkProfileOwner, upload.single("avatar"), validateEditUser, catchAsync(users.updateProfile))
  .put(isLoggedIn, isAdmin, validateEditAdmin, catchAsync(admin.updateAdmin))
  .delete(isLoggedIn, checkProfileOwner, catchAsync(users.deleteUser));

router.route("/users/:id/edit").get(isLoggedIn, checkProfileOwner, catchAsync(users.renderEditProfile));

module.exports = router;
