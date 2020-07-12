import mongoose from "mongoose";

/* ListingSchema will correspond to a collection in your MongoDB database. */
const ListingSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please provide a description for this listings."],
    maxlength: [100, "Description cannot be more than 100 characters"],
  },
  owner: {
    email: String,
  },
  game_slug: {
    type: String,
    required: [true, "Please provide the listing game's slug"],
    index: true,
  },
  platform: {
    name: String,
    url: String,
  },
  price: {
    type: Number,
    min: 0,
  },
  post_code: {
    type: Number,
    min: 0,
  },
});

export default mongoose.models.Listing ||
  mongoose.model("Listing", ListingSchema);
