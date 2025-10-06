// Import neccessary libraries
import AppError from "../utils/AppError.js";
import Post, { getAllPosts, getPostId } from "../models/Post.js";
import { getUserId } from "../models/User.js";
import Likes from "../models/Likes.js";
import Comment, { getComments } from "../models/Comment.js";

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
    const delayMs = 5000;
    const user = await getUserId(req.user.id);
    if (!user) throw new AppError("No user", 401);
    const post = await getPostId(req.body.postId);
    if (!post) throw new AppError("No post", 404);
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
    const lastLike = await Likes.findOne({
      postId: post.id,
      userId: user.id,
    });
    if (lastLike != null) return res.json({ status: "success", result: true });
    else return res.json({ status: "success", result: false });
  } catch (error) {
    next(error);
  }
};

export const commentPost = async (req, res, next) => {
  try {
    const delayMs = 5000;
    const user = await getUserId(req.user.id);
    if (!user) throw new AppError("No user", 401);
    const post = await getPostId(req.body.postId);
    if (!post) throw new AppError("No post", 404);
    const commentText = req.body.text;
    if (commentText.length < 0 || commentText.length > 20000)
      throw new AppError("Post length", 400);
    const lastComment = await Comment.findOne({
      postId: post.id,
      userId: user.id,
    }).sort({ createdAt: -1 });
    if (lastComment && Date.now() - lastComment.createdAt.getTime() < delayMs) {
      const posts = await getAllPosts();
      return res.json({ status: "failed", posts: { posts } });
    }

    await Comment.create({
      author: {
        authorId: req.user.id,
        name: user.username,
        avatarUrl: user.avatar.url,
      },
      postId: post.id,
      text: commentText,
      userId: user.id,
      createdAt: Date.now(),
    });
    await Post.updateOne({ _id: post.id }, { $inc: { commentCount: 1 } });
    const posts = await getAllPosts();
    return res.json({ status: "success", posts: { posts } });
  } catch (error) {
    next(error);
  }
};

export const getComment = async (req, res, next) => {
  try {
    const user = await getUserId(req.user.id);
    if (!user) throw new AppError("No user", 401);
    const comments = await getComments();
    const result = comments.map((p) => ({
      _id: p._id,
      content: p.text,
      author: {
        _id: p.author?.id,
        name: p.author?.name ?? "Unknown",
        avatarUrl: p.author?.avatarUrl ?? "/client/src/assets/no-avatar.png",
      },
      postId: p.postId,
    }));
    return res.json({ status: "success", result: { result } });
  } catch (error) {
    next(error);
  }
};

export const putComment = async (req, res, next) => {
  try {
    const commentText = req.body.text;
    if (commentText.length < 1 || commentText.length > 20000)
      throw new AppError("Post length", 400);
    await Comment.updateOne(
      { _id: req.body.commentId },
      { $set: { text: commentText } }
    );
    return res.json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await Comment.deleteOne({ _id: req.query.commentId });
    const updated = await Post.updateOne(
      { _id: req.query.postId },
      { $inc: { commentCount: -1 } }
    );
    if (updated && updated.commentCount < 0) {
      updated.commentCount = 0;
      await updated.save();
    }
    return res.json({
      status: "success",
      commentCount: updated ? updated.commentCount : 0,
    });
  } catch (error) {
    next(error);
  }
};
