import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadAvatar, deleteAvatar } from "../controllers/userController.js";
import { uploadMemory } from "../lib/multMemory.js";

const router = express.Router();

router.post("/me/avatar", protect, uploadMemory.single("avatar"), uploadAvatar);

router.delete("/me/avatar", protect, deleteAvatar);

export default router;
