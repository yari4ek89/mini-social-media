// Import neccessary libraries
import express from "express";
import {
  createPost,
  getPost,
  likePost,
  getIsLiked,
  commentPost,
  getComment,
  putComment,
  deleteComment,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST routes
router.post("/create-post", protect, createPost);
router.post("/like-post", protect, likePost);
router.post("/get-like", protect, getIsLiked);
router.post("/comment-post", protect, commentPost);
router.post("/get-comments", protect, getComment);

// GET routes
router.get("/get-post", getPost);

// PUT routes
router.put("/update-comment", putComment);

// DELETE routes
router.delete("/delete-comment", deleteComment);

// Export router
export default router;
