// Import neccessary libraries
import AppError from "../utils/AppError.js";
import Post, {getAllPosts, getPostId} from "../models/Post.js";
import {getUserId} from "../models/User.js";
import Likes from "../models/Likes.js";
import Comment, {getComments} from "../models/Comment.js";
import {commentLimiter, cooldown, delay, guard, likeLimiter, postLimiter} from "../utils/rateLimit.js";

// Export create post arrow function
export const createPost = async (req, res, next) => {
    try {
        const {authorId, content} = req.body;
        if (content.length < 1 || content.length > 20000)
            throw new AppError("Post length must be more than 0 and less than 20001 symbols", 400);
        const user = await getUserId(req.user?.id);
        if (!(await guard(postLimiter, req.user?.id, res))) throw new AppError("Too many posts to create, try again later", 429);
        const state = await postLimiter.limit(`${req.user?.id}:peek`);
        if (state.remaining <= 2) await delay(500);
        const ok = await cooldown(`cd:post:${req.user?.id}`, 5000);
        if (!ok) throw new AppError("Wait a bit before creating another post", 429);
        const newPost = new Post({
            author: {authorId, name: user.username, avatarUrl: user.avatar.url},
            content,
            likesCount: 0,
            commentCount: 0,
        });
        await newPost.save();
        return res.json({status: "success", post: {id: newPost.id}});
    } catch (err) {
        next(err);
    }
};

export const getPost = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 1;
        const skip = (page - 1) * limit;
        const posts = await getAllPosts(skip, limit);
        const result = posts.map((p) => ({
            _id: p._id,
            content: p.content,
            author: {
                _id: p.author?.id,
                name: p.author?.name ?? "Unknown",
                avatarUrl: p.author?.avatarUrl ?? "/client/src/assets/no-avatar.png",
            },
        }));
        const total = await Post.countDocuments();
        return res.json({
            status: "success",
            posts: {posts},
            result: {result},
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (error) {
        next(error);
    }
};

export const likePost = async (req, res, next) => {
    try {
        const user = await getUserId(req.user.id);
        if (!user) throw new AppError("You are not loginned", 401);
        const post = await getPostId(req.body.postId);
        if (!post) throw new AppError("There is no post to like", 404);
        if (!(await guard(likeLimiter, req.user?.id, res))) throw new AppError("Too many likes, try again later", 429);
        const state = await postLimiter.limit(`${req.user?.id}:peek`);
        if (state.remaining <= 5) await delay(500);
        const ok = await cooldown(`cd:like:${req.user?.id}:${req.body?.postId}`, 300);
        if (!ok) throw new AppError("Wait a bit before like a post", 429);

        const existing = await Likes.findOne({postId: post.id, userId: user.id});

        if (existing) {
            await Likes.deleteOne({_id: existing._id});
            await Post.updateOne({_id: post.id}, {$inc: {likesCount: -1}});
            return res.json({status: "success1"});
        } else {
            await Likes.create({
                postId: post.id,
                userId: user.id,
                createdAt: Date.now(),
            });
            await Post.updateOne({_id: post.id}, {$inc: {likesCount: 1}});
            return res.json({status: "success"});
        }
    } catch (error) {
        next(error);
    }
};

export const getIsLiked = async (req, res, next) => {
    try {
        const user = await getUserId(req.user.id);
        if (!user) throw new AppError("You are not loginned", 401);
        const post = await getPostId(req.body.postId);
        if (!post) throw new AppError("There is no post to like", 404);
        const lastLike = await Likes.findOne({
            postId: post.id,
            userId: user.id,
        });
        if (lastLike != null) return res.json({status: "success", result: true});
        else return res.json({status: "success", result: false});
    } catch (error) {
        next(error);
    }
};

export const commentPost = async (req, res, next) => {
    try {
        const delayMs = 5000;
        const user = await getUserId(req.user.id);
        if (!user) throw new AppError("You are not loginned", 401);
        const post = await getPostId(req.body.postId);
        if (!post) throw new AppError("There is no comment to like", 404);
        const commentText = req.body.text;
        if (!(await guard(commentLimiter, req.user?.id, res))) throw new AppError("Too many comments, try again later", 429);
        const state = await commentLimiter.limit(`${req.user?.id}:peek`);
        if (state.remaining <= 2) await delay(500);
        const ok = await cooldown(`cd:comment:${req.user?.id}:${req.body?.postId}`, 2000);
        if (!ok) throw new AppError("Wait a bit before creating another comment", 429);
        if (commentText.length < 0 || commentText.length > 20000)
            throw new AppError("Comment length must be more than 0 and less than 20001 symbols", 400);
        const lastComment = await Comment.findOne({
            postId: post.id,
            userId: user.id,
        }).sort({createdAt: -1});
        if (lastComment && Date.now() - lastComment.createdAt.getTime() < delayMs) {
            return res.json({status: "failed"});
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
        });
        await Post.updateOne({_id: post.id}, {$inc: {commentCount: 1}});
        return res.json({status: "success"});
    } catch (error) {
        next(error);
    }
};

export const getComment = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 1;
        const skip = (page - 1) * limit;
        const user = await getUserId(req.user.id);
        if (!user) throw new AppError("You are not loginned", 401);
        const comments = await getComments();
        const result = comments.map((p) => ({
            _id: p._id,
            content: p.text,
            author: {
                authorId: p.author?.authorId,
                name: p.author?.name ?? "Unknown",
                avatarUrl: p.author?.avatarUrl ?? "@/assets/no-avatar.png",
            },
            postId: p.postId,
        }));
        return res.json({
            status: "success", result: {result}
        });
    } catch (error) {
        next(error);
    }
};

export const putComment = async (req, res, next) => {
    try {
        const commentText = req.body.text;
        if (commentText.length < 1 || commentText.length > 20000)
            throw new AppError("Comment length must be more than 0 and less than 20001 symbols", 400);
        await Comment.updateOne(
            {_id: req.body.commentId},
            {$set: {text: commentText}}
        );
        return res.json({status: "success"});
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        await Comment.deleteOne({_id: req.query.commentId});
        const updated = await Post.updateOne(
            {_id: req.query.postId},
            {$inc: {commentCount: -1}}
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
