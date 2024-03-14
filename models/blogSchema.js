const mongoose = require('mongoose')
require('dotenv').config()
const blogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  like: {
    type: Array,
  },
  wishlist: {
    type: Array,
  }
}, {
  versionKey: false,
  timestamps: true
})
let Blogs = mongoose.model(process.env.BLOGCOLLECTION, blogSchema)
module.exports = Blogs