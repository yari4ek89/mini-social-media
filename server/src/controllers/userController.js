import AppError from "../utils/AppError.js";
import { getUserId } from "../models/User.js";
import getCloudinary from "../lib/cloudinary.js";
import { uploadBufferToCloudinary } from "../lib/uploadToCloudinary.js";

export const uploadAvatar = async (req, res, next) => {
  const MAX_MB = 5;
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  try {
    const cloudinary = getCloudinary();
    if (!req.file) throw new AppError("No file", 404);
    if (req.file.size > MAX_MB * 1024 * 1024) {
      throw new AppError("File size is too big (max 5MB)", 400);
    }
    if (!ALLOWED.includes(req.file.mimetype)) {
      throw new AppError("Allowed JPG/PNG/WebP", 400);
    }
    const user = await getUserId(req.user.id);
    if (!user) throw new AppError("User is not found", 404);
    if (user.avatar?.publicId) {
      try {
        await cloudinary.uploader.destroy(user.avatar.publicId);
      } catch {}
    }
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "client/src/assets/avatars",
          resource_type: "image",
          format: "jpg",
          transformation: [
            { width: 256, height: 256, crop: "thumb", gravity: "face" },
          ],
        },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(req.file.buffer);
    });
    user.avatar = { url: result.secure_url, publicId: result.public_id };
    await user.save();
    return res.json({ status: "success", avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

export const deleteAvatar = async (req, res, next) => {
  try {
    const user = await getUserId(req.user._id);
    if (!user) throw new AppError("User is not found", 404);
    if (user.avatar?.publicId) {
      try {
        await cloudinary.uploader.destroy(user.avatar.publicId);
      } catch {}
    }
    user.avatar = { url: "", publicId: "" };
    await user.save();
    return res.json({ status: "success" });
  } catch (error) {
    next(error);
  }
};
