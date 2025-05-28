const { Schema, model, default: mongoose } = require("mongoose");

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
    required: true,
  },

  coverImage: {
    type: String,
    required: false,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
})

const Blog = model("Blog", BlogSchema);

module.exports = Blog;
