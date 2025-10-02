// Import neccessary libraries
import { api } from "./api";
import { toast } from "react-toastify";

export const createPost = async (payload) => {
  const { data } = await api.post("/api/post/create-post", payload);
  if (data.status === "success") {
    toast.success(data.status, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    return await data;
  }
};

export const postsGet = async () => {
  const { data } = await api.get("/api/post/get-post");
  return await data;
};

export const likePost = async (payload, liked) => {
  const { data } = await api.post("/api/post/like-post", payload);
  if ((await data.status) === "success") {
    liked(true);
  } else if ((await data.status) === "success1") {
    liked(false);
  }
  return await data;
};

export const getLiked = async (payload, liked) => {
  const { data } = await api.post("/api/post/get-like", payload);
  liked(await data.result);
  return await data;
};
