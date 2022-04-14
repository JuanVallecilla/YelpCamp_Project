const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    //Doing 1000 because we have 1000 cities in the cities.js array
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porta lacus libero, sagittis volutpat enim porta sed. Mauris libero nibh, posuere at porttitor eget, commodo sit amet risus. Integer auctor, sem auctor auctor porta, leo massa volutpat leo, non lobortis urna erat sed dolor. Donec sodales mollis leo non vulputate. Pellentesque non mi faucibus, tincidunt lorem vestibulum, luctus neque. Aenean tincidunt, justo non varius sagittis, purus quam posuere elit, in fermentum lacus lorem eget velit. Cras quis est nec odio dapibus tempor. Duis ultrices porta tempus.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
