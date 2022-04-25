const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("cardImage").get(function () {
  return this.url.replace("/upload", "/upload/ar_4:3,c_crop");
});

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// When we delete a campground we have to make sure we delete associated reviews for a given campground.
// Deleting Images from cloudinary when we delete an entire campground
CampgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews) {
    await Review.deleteMany({
      _id: { $in: campground.reviews },
    });
  }
  if (campground.images) {
    for (const img of campground.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
