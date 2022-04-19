const express = require("express");
// Router get seperate params so we need to use mergeParams so that all params from app.js will also be merge the params from reviews in order to get access to our :id
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require("../schemas.js");
const Campground = require("../models/campground");
const Review = require("../models/review");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((elements) => elements.message).join("");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // We are using $pull to remove the specific review we want to remove
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Succesfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
