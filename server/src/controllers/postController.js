// Import neccessary libraries
import AppError from "../utils/AppError.js";
import Post, { getAllPosts, getPostId } from "../models/Post.js";
import User, { getUserId } from "../models/User.js";
import Likes, { getLikes } from "../models/Likes.js";

// Export create post arrow function
export const createPost = async (req, res, next) => {
  try {
    const { authorId, content, createdAt, updatedAt } = req.body;
    if (content.length < 1 || content.length > 20000)
      throw new AppError("Post length", 400);
    const user = await getUserId(req.user.id);
    const newPost = new Post({
      author: { authorId, name: user.username, avatarUrl: user.avatar.url },
      content,
      likesCount: 0,
      commentCount: 0,
      createdAt,
      updatedAt,
    });
    await newPost.save();
    return res.json({ status: "success", post: { id: newPost.id } });
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    const result = posts.map((p) => ({
      _id: p._id,
      content: p.content,
      author: {
        _id: p.author?.id,
        name: p.author?.name ?? "Unknown",
        avatarUrl: p.author?.avatarUrl ?? "/client/src/assets/no-avatar.png",
      },
    }));
    return res.json({
      status: "success",
      posts: { posts },
      result: { result },
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const delayMs = 5000;
    const user = await getUserId(req.user.id);
    if (!user) throw new AppError("No user", 401);
    const post = await getPostId(req.body.postId);
    if (!post) throw new AppError("No post", 404);
    const likes = await getLikes();
    const lastLike = await Likes.findOne({
      postId: post.id,
      userId: user.id,
    }).sort({ createdAt: -1 });
    if (lastLike && Date.now() - lastLike.createdAt.getTime() < delayMs) {
      const posts = await getAllPosts();
      return res.json({ status: "failed", posts: { posts } });
    }
    const existing = await Likes.findOne({ postId: post.id, userId: user.id });

    if (existing) {
      await Likes.deleteOne({ _id: existing._id });
      await Post.updateOne({ _id: post.id }, { $inc: { likesCount: -1 } });
      const posts = await getAllPosts();
      return res.json({ status: "success1", posts: { posts } });
    } else {
      await Likes.create({
        postId: post.id,
        userId: user.id,
        createdAt: Date.now(),
      });
      await Post.updateOne({ _id: post.id }, { $inc: { likesCount: 1 } });
      const posts = await getAllPosts();
      return res.json({ status: "success", posts: { posts } });
    }
  } catch (error) {
    next(error);
  }
};

export const getIsLiked = async (req, res, next) => {
  try {
    const user = await getUserId(req.user.id);
    if (!user) throw new AppError("No user", 401);
    const post = await getPostId(req.body.postId);
    if (!post) throw new AppError("No post", 404);
    const likes = await getLikes();
    const lastLike = await Likes.findOne({
      postId: post.id,
      userId: user.id,
    });
    console.log(lastLike);
    if (lastLike != null) return res.json({ status: "success", result: true });
    else return res.json({ status: "success", result: false });
  } catch (error) {
    next(error);
  }
};
