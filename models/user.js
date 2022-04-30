const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = mongoose.model("User", UserSchema);
