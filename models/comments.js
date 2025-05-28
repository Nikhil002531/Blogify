const { model, Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },

  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const Comments = model("Comments", commentSchema);

module.exports = Comments;
