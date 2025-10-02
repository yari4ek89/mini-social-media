import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

let configured = false;

export function getCloudinary() {
  if (!configured) {
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({ secure: true }); // SDK сам возьмёт из CLOUDINARY_URL
    } else {
      const {
        CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET,
      } = process.env;
      if (
        !CLOUDINARY_CLOUD_NAME ||
        !CLOUDINARY_API_KEY ||
        !CLOUDINARY_API_SECRET
      ) {
        throw new Error(
          "Cloudinary env missing. Set CLOUDINARY_URL or three variables: CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET."
        );
      }
      cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        secure: true,
      });
    }
    configured = true;
  }
  return cloudinary;
}

export default getCloudinary;
