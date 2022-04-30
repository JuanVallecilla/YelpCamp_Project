const User = require("../models/user");
const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password, firstName, lastName, phone, avatar } = req.body;
    const user = new User({ email, username, firstName, lastName, phone, avatar });

    // if user does not  submit an avatar image we give him a default avatar
    if (!req.file) {
    } else {
      user.avatar = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }
    const registerUser = await User.register(user, password);
    // Allows the user to automatically ne log-in after registering
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
};

module.exports.userProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    req.flash("error", "Cannot find User!");
    return res.redirect("/campgrounds");
  }

  const campground = await Campground.find().where("author").equals(user._id);
  const reviews = await Review.find().where("user").equals(user._id);
  // const campground = await Campground.find().where("author").equals(req.user._id);
  // const reviews = await Review.find().where("user").equals(req.user._id);
  if (!campground) {
    req.flash("error", "Cannot find Campgrounds!");
    return res.redirect("/campgrounds");
  }
  res.render("users/profile", { user, campgrounds: campground, reviews: reviews });
};
