// Import neccessary libraries
import mongoose from "mongoose";

const {Schema} = mongoose;

// Define postSchema with creator id, content, likes count, comment count, createdAt and updateAt
const postSchema = new Schema({
    author: {
        authorId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        name: String,
        avatarUrl: String,
    },
    content: String,
    likesCount: Number,
    commentCount: Number,
}, {timestamps: true});

export const getAllPosts = async (skip, limit) => {
    try {
        const posts = await Post.find({}).sort({createdAt: -1}).skip(skip).limit(limit);
        return posts;
    } catch (error) {
        return console.log(error);
    }
};

export const getPostId = async (id) => {
    try {
        return await Post.findById(id);
    } catch (err) {
        return false;
    }
};

// Define a new model from postSchema
const Post = mongoose.model("Post", postSchema);

export default Post;
