const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },

  authorLink: {
    type: String,
    required: true,
  },

  genres: {
    type: String,
    required: true,
  },
  idApi: {
    type: Number,
    required: true,
  },
});

const Anime = mongoose.model("Anime", animeSchema);

module.exports = Anime;
