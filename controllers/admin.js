const User = require("../models/user");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { cloudinary } = require("../cloudinary");
const ADMIN_SECRET = process.env.ADMIN_SECRET;

module.exports.userAdmin = async (req, res) => {
  User.find({})
    .populate("campgrounds")
    .exec(function (err, foundUsers) {
      if (err || !foundUsers) {
        req.flash("error", "Something went wrong");
        res.redirect("/campgrounds");
      } else {
        res.render("users/admin", { users: foundUsers });
      }
    });
};
