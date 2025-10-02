// Import neccessary libraries
import express from "express";
import {
  createPost,
  getPost,
  likePost,
  getIsLiked,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST routes
router.post("/create-post", protect, createPost);
router.post("/like-post", protect, likePost);
router.post("/get-like", protect, getIsLiked);

// GET routes
router.get("/get-post", getPost);

// Export router
export default router;
