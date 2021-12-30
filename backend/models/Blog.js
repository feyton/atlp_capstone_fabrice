const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comments: [{ body: String, date: Date }],
  meta: {
    votes: Number,
    favs: Number,
  },
  photoURL: URL,
});

module.exports = mongoose.model("Blog", blogSchema);
