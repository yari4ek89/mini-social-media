import mongoose from "mongoose";
const { Schema } = mongoose;

const LikesSchema = new Schema({
  postId: String,
  userId: String,
  createdAt: {type: Date, default: Date.now()},
});

export const getLikes = async () => {
  try {
    const likes = await Likes.find({});
    return likes;
  } catch (error) {
    return false;
  }
};

const Likes = mongoose.model("Likes", LikesSchema);

export default Likes;
