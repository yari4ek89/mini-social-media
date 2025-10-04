import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema({
  author: {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    avatarUrl: String,
  },
  postId: String,
  text: String,
  createdAt: { type: Date, default: Date.now() },
});

export const getComments = async () => {
  try {
    const comments = await Comment.find({});
    return comments;
  } catch (error) {
    return false;
  }
};

const Comment = mongoose.model("Comments", CommentSchema);

export default Comment;
