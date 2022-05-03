const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary");

const passportLocalMongoose = require("passport-local-mongoose");

const ImageProfileSchema = new Schema({
  url: String,
  filename: String,
});

ImageProfileSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/ar_4:3,c_crop");
});

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  avatar: [ImageProfileSchema],
  phone: String,
  bio: [String],
  email: {
    type: String,
    require: true,
    unique: true,
  },
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

UserSchema.plugin(passportLocalMongoose);

// handling the unique email error
UserSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000 && error.keyValue.email) {
    next(new Error("Email address was already taken, please choose a different one."));
  } else {
    next(error);
  }
});

// userSchema.post("findOneAndDelete", async function (campground) {
//   //delete all related reviews
//   if (campground.reviews) {
//     await Review.deleteMany({
//       _id: {
//         $in: campground.reviews,
//       },
//     });
//   }
//   //delete all related campgrounds
//   await Campground.deleteMany(campground.author._id);

//   //delete images on cloudinary
//   if (campground.images) {
//     for (const img of campground.images) {
//       await cloudinary.uploader.destroy(img.filename);
//     }
//   }
// });

module.exports = mongoose.model("User", UserSchema);
